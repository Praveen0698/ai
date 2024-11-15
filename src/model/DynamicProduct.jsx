import mongoose from "mongoose";

const productSchema = new mongoose.Schema({}, { strict: false });

const ProductDynamic =
  mongoose.models.ProductDynamic ||
  mongoose.model("ProductDynamic", productSchema);

export default ProductDynamic;
