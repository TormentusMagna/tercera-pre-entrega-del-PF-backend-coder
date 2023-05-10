import { Schema, model, SchemaTypes } from 'mongoose';

const CartSchema = new Schema({
  products: [
    {
      product: { type: SchemaTypes.ObjectId, ref: 'Product' },
      quantity: Number,
    },
  ],
});

const CartModel = model('Cart', CartSchema);

export default CartModel;
