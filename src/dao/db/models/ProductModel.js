import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const ProductSchema = new Schema({
  title: String,
  description: String,
  code: String,
  price: Number,
  status: Boolean,
  stock: Number,
  category: String,
  thumbnails: Array,
});
ProductSchema.plugin(mongoosePaginate);

const ProductModel = model('Product', ProductSchema);

export default ProductModel;
