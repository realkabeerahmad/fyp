// Using Mongoose for Mongoo DB
const mongoose = require("mongoose");
// Product Schema
const ProductSchema = mongoose.Schema({
  name: { type: String, index: true },
  category: { type: String, index: true },
  quantity: Number,
  price: Number,
  description: String,
  Warranty: String,
  Return: String,
  StandardShipping: String,
  FastShipping: String,
  Image: String,
  rating: [
    {
      userId: String,
      value: Number,
    },
  ],
  totalRating: { type: Number, default: 0 },
  NumberSold: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});
ProductSchema.index({ name: "text", category: "text" });
// Exporting Product Model
module.exports = mongoose.model("product", ProductSchema);
