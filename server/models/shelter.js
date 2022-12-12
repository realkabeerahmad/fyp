// Using Mongoose for Mongoo DB
const mongoose = require("mongoose");
// Shelter Schema
const ShelterSchema = mongoose.Schema({
  name: String,
  description: String,
  address: String,
  email: String,
  phone: String,
  Logo: { type: String },
  RegistrationNo: String,
  // password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
// Exporting Shelter Model
module.exports = mongoose.model("shelters", ShelterSchema);
