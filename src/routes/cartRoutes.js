import { Router } from 'express';
import * as cartControllers from '../controllers/cartControllers.js';

const router = Router();

// RUTA RAI> PARA OBTENER PRODUCTS DEL CARRITO
router.get('/carts/:cid', cartControllers.getCartProducts);

// @CRUD_verb: CREATE
// @Type: POST
// Action: Create new cart
router.post('/api/carts', cartControllers.addCart);

// @CRUD_verb: READ
// @Type: GET
// Action: Get products from a cart
router.get('/api/carts/:cid', cartControllers.getCartProducts);

// @CRUD_verb: CREATE
// @Type: POST
// Action: Add products to a cart
router.post('/api/carts/:cid/product/:pid', cartControllers.addProductsToCart);

// @CRUD_verb: UPDATE
// @Type: PUT
// Action: Update product quantity with value provided from req.body
router.put(
  'api/carts/:cid/products/:pid',
  cartControllers.updateProductQuantityReqBody
);

// @CRUD_verb: DELETE
// @Type: DELETE
// Action: Delete a single product from a specific cart
router.delete(
  '/api/carts/:cid/products/:pid',
  cartControllers.deleteProductFromCart
);

// @CRUD_verb: DELETE
// @Type: DELETE
// Action: Delete all products from a specific cart
router.delete('/api/carts/:cid', cartControllers.deleteAllProductsFromCart);

export default router;
