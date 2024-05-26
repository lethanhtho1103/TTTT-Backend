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
  category: {
    type: mongoose.Schema.Type.ObjectId, ref: "Category"
  },
});

module.exports = mongoose.model("Product", Product);
