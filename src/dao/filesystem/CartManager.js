import { readFile, writeFile } from 'fs/promises';
import * as ProductModel from './models/ProductModel.js';

class CartManager {
  constructor(path) {
    this.path = path;
  }

  //====================
  // CRUD ACTIONS
  //====================
  // @CRUD_verb: CREATE
  // Action: Add new cart
  addCart = async () => {
    try {
      const carts = await JSON.parse(await readFile(this.path));
      const newCart = {
        id: (await carts.length) + 1,
        products: [],
      };
      await carts.push(newCart);
      await writeFile(this.path, JSON.stringify(carts));

      return { status: 'success', payload: 'New cart added successfully' };
    } catch (err) {
      return { status: 'error', payload: `${err.message}` };
    }
  };

  // @CRUD_verb: READ
  // Action: Get products from a specific cart
  getCartProducts = async (cid) => {
    try {
      const carts = await JSON.parse(await readFile(this.path));
      const cartExists = await carts.some((e) => e.id === parseInt(cid));
      if (!cartExists) throw new Error('The cart not exists');

      if (cartExists) {
        const cartSelected = await carts.find((e) => e.id === parseInt(cid));
        if (cartSelected.products.length > 0) {
          return { status: 'success', payload: cartSelected.products };
        } else {
          return { status: 'success', payload: `The cart is empty` };
        }
      }
    } catch (err) {
      return { status: 'error', payload: `${err.message}` };
    }
  };

  // @CRUD_verb: CREATE
  // Action: Add products to a specific cart
  addProductsToCart = async (cid, pid) => {
    try {
      // Verify if cart exists
      const carts = await JSON.parse(await readFile(this.path));
      const cartExists = await carts.some((e) => e.id === parseInt(cid));
      if (!cartExists) throw new Error('The cart not exists');

      // Verify if product exists
      const products = await ProductModel.getProducts();
      const productExists = await products.payload.some(
        (e) => e.id === parseInt(pid)
      );
      if (!productExists) throw new Error('The product not exists');

      // Verify if product is already in cart
      const cartSelected = await carts.find((e) => e.id === parseInt(cid));
      const productAlreadyInCart = await cartSelected.products.some(
        (e) => e.product === parseInt(pid)
      );

      // ACTIONS If product's already in cart TRUE
      if (productAlreadyInCart) {
        const productInCart = await cartSelected.products.find(
          (e) => e.product === parseInt(pid)
        );
        const quantity = (await productInCart.quantity) + 1;
        const updateQuantity = await cartSelected.products.map((e) =>
          e.product === parseInt(pid) ? { ...e, quantity } : e
        );
        cartSelected.products = updateQuantity;
        const cartsUpdated = await carts.map((e) =>
          e.id === parseInt(cid) ? { ...cartSelected } : e
        );
        await writeFile(this.path, JSON.stringify(cartsUpdated));

        return {
          status: 'success',
          payload: 'Product quantity updated successfully',
        };
      } else {
        const productToAdd = { product: parseInt(pid), quantity: 1 };
        cartSelected.products.push(productToAdd);
        const productAddedToCart = await carts.map((e) =>
          e.id === parseInt(cid) ? { ...e, ...cartSelected } : e
        );
        await writeFile(this.path, JSON.stringify(productAddedToCart));

        return {
          status: 'success',
          payload: 'New product added successfully to cart',
        };
      }
    } catch (err) {
      return { status: 'error', payload: `${err.message}` };
    }
  };
}

export default CartManager;
