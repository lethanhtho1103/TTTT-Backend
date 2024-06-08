  const mongoose = require("mongoose");
  const Schema = mongoose.Schema;

  const Product = new Schema({
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
    },
    image: {
      type: String,
      default: "",
    },
    category_id: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
    productDetail: {
      type: mongoose.Types.ObjectId,
      ref: "ProductDetail",
    },
  });

  module.exports = mongoose.model("Product", Product);
