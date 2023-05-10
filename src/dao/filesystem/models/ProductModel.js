import ProductManager from '../ProductManager.js';
import path from 'path';
import __dirname from '../../../utils.js';

const adminProducts = new ProductManager(
  path.resolve(__dirname, 'files', 'productList.json')
);

// @CRUD_verb: CREATE
// Action: Add product Model
const addProduct = (productData) => {
  return adminProducts.addProduct(productData);
};

// @CRUD_verb: READ
// Action: Get all products Model
const getProducts = (limit) => {
  return adminProducts.getProducts(limit);
};

// @CRUD_verb: READ
// Action: Get single product Model
const getProductById = (pid) => {
  return adminProducts.getProductById(pid);
};

// @CRUD_verb: UPDATE
// Action: Update product Model
const updateProduct = (productData, pid) => {
  return adminProducts.updateProduct(productData, pid);
};

// @CRUD_verb: DELETE
// Action: Delete product Model
const deleteProduct = (pid) => {
  return adminProducts.deleteProduct(pid);
};

export {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
