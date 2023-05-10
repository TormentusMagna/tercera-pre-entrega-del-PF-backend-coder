// import * as ProductModel from '../dao/filesystem/models/ProductModel.js';
import ProductModel from '../dao/db/models/ProductModel.js';

// @CRUD_verb: CREATE
// @Type: POST
// Action: Add product
const addProduct = async (req, res) => {
  const productData = req.body;

  // Filesystem actions
  // const result = await ProductModel.addProduct(productData);
  // result.payload === `ID property's an invalid field`
  //   ? res.status(400).json({ data: result })
  //   : result.status === 'error'
  //   ? res.status(500).json({ data: result })
  //   : res.status(201).json({ data: result });

  // Mongoose actions
  try {
    if (productData._id || productData.id)
      throw new Error(`ID property's an invalid field`);

    const result = await ProductModel.create(productData);
    return res
      .status(201)
      .json({ status: 'success', payload: `New product added successfully` });
  } catch (err) {
    const result = { status: 'error', payload: `${err.message}` };
    result.payload === `ID property's an invalid field`
      ? res.status(400).json(result)
      : result.status === `error`
      ? res.status(500).json(result)
      : null;
  }
};

// @CRUD_verb: READ
// @Type: GET
// Action: Get all products
const getProducts = async (req, res) => {
  let { limit, page, query, sort } = req.query;
  const { host } = req.headers;
  const path = req.path;

  // Filesystem actions
  // const result = await ProductModel.getProducts(limit);
  // const opts = {
  //   pageTitle: 'HomePage',
  //   products: result.payload,
  // };
  // result.status === 'error'
  //   ? res.status(500).json({ data: result })
  //   : req.path === '/api/products'
  //   ? res.status(200).json({ data: result })
  //   : req.path === '/products'
  //   ? res.status(200).render('products', opts)
  //   : null;

  // Mongoose actions
  try {
    const optsPaginate = {
      limit: !limit || limit >= 10 || limit === '0' ? (limit = 10) : limit,
      page: !page || page === '' ? (page = 1) : page,
      query: !query || query === '' ? (query = null) : query,
      sort:
        !sort || sort === ''
          ? (sort = null)
          : sort === 'asc'
          ? { price: 0 }
          : sort === 'desc'
          ? { price: -1 }
          : null,
    };

    const filterSearch = query ? { category: query } : {};

    const productsPaginate = await ProductModel.paginate(
      filterSearch,
      optsPaginate
    );

    const result = {
      status: 'success',
      payload: productsPaginate.docs,
      totalPages: productsPaginate.totalPages,
      prevPage: productsPaginate.prevPage,
      nextPage: productsPaginate.nextPage,
      page: productsPaginate.page,
      hasPrevPage: productsPaginate.hasPrevPage,
      hasNextPage: productsPaginate.hasNextPage,
      prevLink: !productsPaginate.hasPrevPage
        ? null
        : `${req.headers.host}${req.path}?page=${page - 1}`,
      nextLink: !productsPaginate.hasNextPage
        ? null
        : page === '1'
        ? `${req.headers.host}${req.path}?page=2`
        : `${req.headers.host}${req.path}?page=${page + 1}`,
    };

    const opts = {
      pageTitle: 'HomePage',
      products: result.payload,
      prevLink: result.prevLink,
      nextLink: result.nextLink,
      page: result.page,
      links: true,
      host,
      path,
    };

    req.path === '/api/products'
      ? res.status(200).json(result)
      : req.path === '/products'
      ? res.status(200).render('products', opts)
      : null;
  } catch (err) {
    const result = { status: 'error', payload: `${err.message}` };
    return res.status(500).json(result);
  }
};

// @CRUD_verb: READ
// @Type: GET
// Action: Get single product
const getProductById = async (req, res) => {
  const { pid } = req.params;
  const { host } = req.headers;
  const path = req.path;
  // Filesystem actions
  // const result = await ProductModel.getProductById(pid);
  // const opts = {
  //   pageTitle: result.payload.title,
  //   products: result.payload,
  // };
  // result.payload === 'The product not exists'
  //   ? res.status(404).json({ data: result })
  //   : result.status === 'error'
  //   ? res.status(500).json({ data: result })
  //   : req.path === `/api/products/${pid}`
  //   ? res.status(200).json({ data: result })
  //   : req.path === `/products/${pid}`
  //   ? res.status(200).render('productDetails', opts)
  //   : null;

  // Mongoose actions
  try {
    const productsPaginate = await ProductModel.paginate({ _id: pid });
    const opts = {
      pageTitle: 'Single Product',
      products: productsPaginate.docs,
      links: false,
      host,
      path,
    };

    if (productsPaginate.docs.length === 0)
      throw new Error(`The product not exists`);

    return res.status(200).render('productDetails', opts);
  } catch (err) {
    const result = { status: 'error', payload: `${err.message}` };
    result.payload.includes(`Cast to ObjectId failed for value`)
      ? res.status(400).json(result)
      : result.payload === `The product not exists`
      ? res.status(404).json(result)
      : result.status === 'error'
      ? res.status(500).json(result)
      : null;
  }
};

// @CRUD_verb: UPDATE
// @Type: PUT
// Action: Update product
const updateProduct = async (req, res) => {
  const productData = req.body;
  const { pid } = req.params;

  // Filesystem actions
  // const result = await ProductModel.updateProduct(productData, pid);
  // result.payload === `ID property's an invalid field`
  //   ? res.status(400).json({ data: result })
  //   : result.payload === `The product not exists`
  //   ? res.status(404).json({ data: result })
  //   : result.status === 'error'
  //   ? res.status(500).json({ data: result })
  //   : res.status(201).json({ data: result });

  // Mongoose actions
  try {
    if (productData._id || productData.id)
      throw new Error(`ID property's an invalid field`);

    const result = await ProductModel.findByIdAndUpdate(
      { _id: pid },
      productData
    );
    if (result === null) throw new Error(`The product not exists`);

    return res
      .status(201)
      .json({ status: 'success', payload: `Product updated successfully` });
  } catch (err) {
    const result = { status: 'error', payload: `${err.message}` };
    result.payload === `ID property's an invalid field`
      ? res.status(400).json(result)
      : result.payload.includes(`Cast to ObjectId failed for value`)
      ? res.status(400).json(result)
      : result.payload === `The product not exists`
      ? res.status(404).json(result)
      : result.status === 'error'
      ? res.status(500).json(result)
      : null;
  }
};

// @CRUD_verb: DELETE
// @Type: DELETE
// Action: Delete product
const deleteProduct = async (req, res) => {
  const { pid } = req.params;

  // Filesystem actions
  // const result = await ProductModel.deleteProduct(pid);
  // result.payload === 'The product not exists'
  //   ? res.status(404).json({ data: result })
  //   : result.status === 'error'
  //   ? res.status(500).json({ data: result })
  //   : res.status(200).json({ data: result });

  // Mongoose actions
  try {
    const result = await ProductModel.findByIdAndDelete({ _id: pid });
    if (result === null) throw new Error(`The product not exists`);

    return res
      .status(200)
      .json({ status: 'success', payload: `Product deleted successfully` });
  } catch (err) {
    const result = { status: 'error', payload: `${err.message}` };
    result.payload.includes(`Cast to ObjectId failed for value`)
      ? res.status(400).json(result)
      : result.payload === `The product not exists`
      ? res.status(404).json(result)
      : result.status === 'error'
      ? res.status(500).json(result)
      : null;
  }
};

export {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
