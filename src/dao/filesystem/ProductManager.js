import { writeFile, readFile } from 'fs/promises';

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  //====================
  // CRUD ACTIONS
  //====================
  // @CRUD_verb: CREATE
  // Action: Add product
  addProduct = async (productData) => {
    try {
      if (productData.id || productData._id)
        throw new Error(`ID property's an invalid field`);

      const products = await JSON.parse(await readFile(this.path));
      const newProduct = {
        id: (await products.length) + 1,
        ...productData,
      };
      await products.push(newProduct);
      await writeFile(this.path, JSON.stringify(products));

      return {
        status: 'success',
        payload: 'Product added successfully',
      };
    } catch (err) {
      return { status: 'error', payload: `${err.message}` };
    }
  };

  // @CRUD_verb: READ
  // Action: Get all products
  getProducts = async (limit) => {
    try {
      if (limit === undefined || limit === null || limit === '') {
        const products = await JSON.parse(await readFile(this.path));
        return { status: 'success', payload: products };
      } else {
        const products = await JSON.parse(await readFile(this.path));
        limit > products.length || limit >= 10 || limit === '0'
          ? (limit = 10)
          : limit;
        const filteredProducts = await products.filter((e) => e.id <= limit);
        return { status: 'success', payload: filteredProducts };
      }
    } catch (err) {
      return { status: 'error', payload: `${err.message}` };
    }
  };

  // @CRUD_verb: READ
  // Action: Get single product
  getProductById = async (pid) => {
    try {
      const products = await JSON.parse(await readFile(this.path));
      const productExists = await products.some((e) => e.id === parseInt(pid));
      if (!productExists) throw new Error(`The product not exists`);

      if (productExists) {
        const product = await products.find((e) => e.id === parseInt(pid));
        return { status: 'success', payload: product };
      }
    } catch (err) {
      return { status: 'error', payload: `${err.message}` };
    }
  };

  // @CRUD_verb: UPDATE
  // Action: Update product
  updateProduct = async (productData, pid) => {
    try {
      if (productData.id || productData._id)
        throw new Error(`ID property's an invalid field`);

      const products = await JSON.parse(await readFile(this.path));
      const productExists = await products.some((e) => e.id === parseInt(pid));
      if (!productExists) throw new Error(`The product not exists`);

      if (productExists) {
        const product = await products.find((e) => e.id === parseInt(pid));
        const updated = await products.map((e) =>
          e.id === parseInt(pid) ? { ...e, ...productData } : e
        );
        await writeFile(this.path, JSON.stringify(updated));
        return { status: 'success', payload: `Product updated successfully` };
      }
    } catch (err) {
      return { status: 'error', payload: `${err.message}` };
    }
  };

  // @CRUD_verb: DELETE
  // Action: Delete product
  deleteProduct = async (pid) => {
    try {
      const products = await JSON.parse(await readFile(this.path));
      const productExists = await products.some((e) => e.id === parseInt(pid));
      if (!productExists) throw new Error(`The product not exists`);

      if (productExists) {
        const product = await products.find((e) => e.id === parseInt(pid));
        const deleted = await products.filter((e) => e.id !== parseInt(pid));
        await writeFile(this.path, JSON.stringify(deleted));
        return { status: 'success', payload: `Product deleted successfully` };
      }
    } catch (err) {
      return { status: 'error', payload: `${err.message}` };
    }
  };
}

export default ProductManager;
