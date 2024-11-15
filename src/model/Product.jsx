import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  products: { type: String },
});

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
