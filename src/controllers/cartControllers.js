// import * as CartModel from '../dao/filesystem/models/CartModel.js';
import CartModel from '../dao/db/models/CartModel.js';
import ProductModel from '../dao/db/models/ProductModel.js';

// @CRUD_verb: CREATE
// @Type: POST
// Action: Add new cart
const addCart = async (req, res) => {
  // Filesystem actions
  // const result = await CartModel.addCart();
  // result.status === 'error'
  //   ? res.status(500).json({ data: result })
  //   : res.status(201).json({ data: result });

  // Mongoose actions
  try {
    const carts = await CartModel.find();
    const newCart = {
      products: [],
    };
    carts.push(newCart);
    const result = await CartModel.create(carts);

    return res
      .status(201)
      .json({ status: 'success', payload: `New cart added successfully` });
  } catch (err) {
    const result = { status: 'error', payload: `${err.message}` };
    return res.status(500).json(result);
  }
};

// @CRUD_verb: CREATE
// @Type: POST
// Action: Add products to a specific cart
const addProductsToCart = async (req, res) => {
  const { cid, pid } = req.params;

  // Filesystem actions
  // const result = await CartModel.addProductsToCart(cid, pid);
  // result.payload === `The cart not exists` ||
  // result.payload === `The product not exists`
  //   ? res.status(404).json({ data: result })
  //   : result.status === 'error'
  //   ? res.status(500).json({ data: result })
  //   : result.payload === `Product quantity updated successfully`
  //   ? res.status(200).json({ data: result })
  //   : result.payload === `New product added successfully to cart`
  //   ? res.status(201).json({ data: result })
  //   : null;

  // Mongoose actions
  try {
    // All carts
    const carts = await CartModel.find();

    // Verify if cart exists
    const cartSelected = await CartModel.findById(cid);
    if (cartSelected === null) throw new Error(`The cart not exists`);

    // Verify if product exists
    const productSelected = await ProductModel.findById(pid);
    if (productSelected === null) throw new Error(`The product not exists`);

    // Verify if product is already in cart
    const productAlreadyInCart = cartSelected.products.some(
      (p) => parseInt(p.product) === parseInt(pid)
    );

    // ACTIONS If product is already in cart TRUE
    if (productAlreadyInCart) {
      const productInCart = cartSelected.products.find(
        (p) => parseInt(p.product) === parseInt(pid)
      );
      const quantity = productInCart.quantity + 1;

      const updateQuantity = cartSelected.products.map((p) =>
        parseInt(p.product) === parseInt(pid) ? { ...p, quantity } : p
      );
      cartSelected.products = updateQuantity;

      const up = await CartModel.findByIdAndUpdate(
        { _id: cid },
        { ...cartSelected }
      );
      return res
        .status(200)
        .json({ status: 'success', payload: `Product quantity was updated` });
    } else {
      // ADD PRODUCT STEPS if product isn't already in cart
      // ===================================================
      const product = {
        product: pid,
        quantity: 1,
      };
      cartSelected.products.push(product);
      const addingProduct = await CartModel.findByIdAndUpdate(
        { _id: cid },
        { products: cartSelected.products }
      );
      return res
        .status(201)
        .json({ status: 'success', payload: `New product was added to cart` });
    }
  } catch (err) {
    console.log(err.message);
    const result = { status: 'error', payload: `${err.message}` };
    result.payload.includes(`Cast to ObjectId failed for value`)
      ? res.status(400).json(result)
      : result.payload === `The cart not exists` ||
        result.payload === `The product not exists`
      ? res.status(404).json(result)
      : result.status === 'error'
      ? res.status(500).json(result)
      : null;
  }
};

// @CRUD_verb: READ
// @Type: GET
// Action: Get products from a specific cart
const getCartProducts = async (req, res) => {
  const { cid } = req.params;

  // Filesystem actions
  // const result = await CartModel.getCartProducts(cid);
  // result.payload === `The cart not exists`
  //   ? res.status(404).json({ data: result })
  //   : result.payload === `The cart is empty`
  //   ? res.status(200).json({ data: result })
  //   : result.status === 'error'
  //   ? res.status(500).json({ data: result })
  //   : res.status(200).json({ data: result.payload });

  // Mongoose actions
  try {
    const result = await CartModel.findById({ _id: cid }).populate(
      'products.product'
    );
    if (result === null) throw new Error(`The cart not exists`);

    const opts = {
      pageTitle: 'Tu carrito de compras',
      products: result.products,
    };

    req.path === `/carts/${cid}`
      ? res.status(200).render('itemsInCart', opts)
      : req.path === `/api/carts/${cid}`
      ? res.status(200).json({ status: 'success', payload: result.products })
      : null;
  } catch (err) {
    console.log(err.message);
    const result = { status: 'error', payload: `${err.message}` };
    result.payload.includes(`Cast to ObjectId failed for value`)
      ? res.status(400).json(result)
      : result.payload === `The cart not exists`
      ? res.status(404).json({ result })
      : result.status === 'error'
      ? res.status(500).json(result)
      : null;
  }
};

// @CRUD_verb: UPDATE
// @Type: PUT
// Action: Update product quantity with value provided from req.body
const updateProductQuantityReqBody = async (req, res) => {
  const { cid, pid } = req.params;
  const { numberOfItems } = req.body;

  try {
    // Verify if cart exists
    const cartSelected = await CartModel.findById(cid);
    if (cartSelected === null) throw new Error(`The cart not exists`);

    // Verify if product exists
    const productSelected = await ProductModel.findById(pid);
    if (productSelected === null) throw new Error(`The product not exists`);

    // Verify if product is already in cart
    const productAlreadyInCart = cartSelected.products.some(
      (p) => parseInt(p.product) === parseInt(pid)
    );

    if (productAlreadyInCart) {
      const productInCart = cartSelected.products.find(
        (p) => parseInt(p.product) === parseInt(pid)
      );
      const quantity = numberOfItems;

      const quantityUpdated = cartSelected.products.map((p) =>
        parseInt(p.product) === parseInt(pid) ? { ...p, quantity } : p
      );

      cartSelected.products = quantityUpdated;

      const up = await CartModel.findByIdAndUpdate({ _id: cid }, cartSelected);

      return res.status(201).json({
        status: 'success',
        payload: `Product quantity was updated successfully`,
      });
    } else {
      throw new Error(`The product isn't in cart`);
    }
  } catch (err) {
    console.log(err.message);
    const result = { status: 'error', payload: `${err.message}` };
    result.payload.includes(`Cast to ObjectId failed for value`)
      ? res.status(406).json(result)
      : result.payload === `The cart not exists` ||
        result.payload === `The product not exists` ||
        result.payload === `The product isn't in cart`
      ? res.status(404).json(result)
      : result.status === 'error'
      ? res.status(500).json(result)
      : null;
  }
};

// @CRUD_verb: DELETE
// @Type: DELETE
// Action: Delete product from a specific cart
const deleteProductFromCart = async (req, res) => {
  const { cid, pid } = req.params;

  try {
    // All carts
    const carts = await CartModel.find();

    // Verify if cart exists
    const cartSelected = await CartModel.findById(cid);
    if (cartSelected === null) throw new Error(`The cart not exists`);

    // Verify if product exists
    const productSelected = await ProductModel.findById(pid);
    if (productSelected === null) throw new Error(`The product not exists`);

    // Verify if product exists in cart
    const productAlreadyInCart = cartSelected.products.some(
      (p) => parseInt(p.product) === parseInt(pid)
    );

    if (productAlreadyInCart) {
      // Generate new array of products without product to delete
      const productDeleted = cartSelected.products.filter(
        (p) => parseInt(p.product) !== parseInt(pid)
      );
      cartSelected.products = productDeleted;

      const deleted = await CartModel.findByIdAndUpdate(cid, cartSelected);
      return res
        .status(200)
        .json({ status: 'success', payload: 'Product deleted successfully' });
    } else {
      throw new Error(`The product isn't in cart`);
    }
  } catch (err) {
    console.log(err.message);
    const result = { status: 'error', payload: `${err.message}` };
    result.payload.includes(`Cast to ObjectId failed for value`)
      ? res.status(400).json(result)
      : result.payload === `The cart not exists` ||
        result.payload === `The product not exists` ||
        result.payload === `The product isn't in cart`
      ? res.status(404).json(result)
      : result.status === 'error'
      ? res.status(500).json(result)
      : null;
  }
};

// @CRUD_verb: DELETE
// @Type: DELETE
// Action: Delete all products from a specific cart
const deleteAllProductsFromCart = async (req, res) => {
  const { cid } = req.params;
  try {
    // All carts
    const carts = await CartModel.find();
    // console.log(carts);

    // Verify if cart exists
    const cartExists = carts.some((p) => parseInt(p._id) === parseInt(cid));

    // If cart exists TRUE
    if (cartExists) {
      const cartSelected = await CartModel.findById({ _id: cid });
      cartSelected.products = [];
      // console.log(cartSelected);
      const itemsDeleted = await CartModel.findByIdAndUpdate(
        { _id: cid },
        cartSelected
      );
      return res.status(200).json({
        status: 'success',
        payload: `All products deleted successfully from cart`,
      });
    } else {
      throw new Error(`The cart not exists`);
    }
  } catch (err) {
    console.log(err.message);
    const result = { status: 'error', payload: `${err.message}` };
    result.payload === 'The cart not exists'
      ? res.status(404).json(result)
      : result.status === 'error'
      ? res.status(500).json(result)
      : null;
  }
};

export {
  addCart,
  addProductsToCart,
  getCartProducts,
  updateProductQuantityReqBody,
  deleteProductFromCart,
  deleteAllProductsFromCart,
};
