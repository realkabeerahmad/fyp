// Using Mongoose for Mongoo DB
const mongoose = require("mongoose");
// User Schema
const UserSchema = mongoose.Schema({
  name: String,
  cnic: String,
  dob: Date,
  gender: String,
  email: { type: String, required: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
  Image: { type: String },
  isAdmin: { type: Boolean, default: false },
  isShelter: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  product_wish: [{ _id: String, image: String, name: String }],
  pet_wish: [{ _id: String, image: String, name: String }],
});
// Expoting User Model
module.exports = mongoose.model("users", UserSchema);
