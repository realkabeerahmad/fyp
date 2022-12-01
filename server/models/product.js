// Using Mongoose for Mongoo DB
const mongoose = require("mongoose");
// Product Schema
const ProductSchema = mongoose.Schema({
  name: String,
  category: String,
  quantity: Number,
  price: Number,
  description: String,
  Warranty: String,
  Return: String,
  StandardShipping: String,
  FastShipping: String,
  Image: String,
  NumberSold: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});
// Exporting Product Model
module.exports = mongoose.model("product", ProductSchema);
