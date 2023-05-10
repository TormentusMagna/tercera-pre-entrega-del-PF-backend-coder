import { Router } from 'express';
import * as productControllers from '../controllers/productControllers.js';

const router = Router();

//RUTA RAIZ ||
// @CRUD_verb: READ
// @Type: GET
// Action: Get all products
router.get('/products', productControllers.getProducts);

//RUTA RAIZ
// @CRUD_verb: READ
// @Type: GET
// Action: Get a single product
router.get('/products/:pid', productControllers.getProductById); // VERIFICAR SI SE QUEDA O NO

// @CRUD_verb: CREATE
// @Type: POST
// Action: Get all products
router.post('/api/products', productControllers.addProduct);

// @CRUD_verb: READ
// @Type: GET
// Action: Get all products
router.get('/api/products', productControllers.getProducts);

// @CRUD_verb: READ
// @Type: GET
// Action: Get a single product
router.get('/api/products/:pid', productControllers.getProductById);

// @CRUD_verb: UPDATE
// @Type: PUT
// Action: Update a product
router.put('/api/products/:pid', productControllers.updateProduct);

// @CRUD_verb: DELETE
// @Type: DELETE
// Action: Delete a product
router.delete('/api/products/:pid', productControllers.deleteProduct);

export default router;
