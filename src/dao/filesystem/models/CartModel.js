import CartManager from '../CartManager.js';
import path from 'path';
import __dirname from '../../../utils.js';

const adminCarts = new CartManager(
  path.resolve(__dirname, 'files', 'carts.json')
);

// @CRUD_verb: CREATE
// Action: Add new cart Model
const addCart = () => {
  return adminCarts.addCart();
};

// @CRUD_verb: READ
// Action: Get products from a specific cart Model
const getCartProducts = (cid) => {
  return adminCarts.getCartProducts(cid);
};

// @CRUD_verb: CREATE
// Action: Add products to a specific cart Model
const addProductsToCart = (cid, pid) => {
  return adminCarts.addProductsToCart(cid, pid);
};

export { addCart, getCartProducts, addProductsToCart };
