// Using Mongoose for Mongoo DB
const mongoose = require("mongoose");
// Shelter Schema
const ShelterSchema = mongoose.Schema({
  name: String,
  description: String,
  address: String,
  RegistrationNo: String,
  createdAt: { type: Date, default: Date.now },
});
// Exporting Shelter Model
module.exports = mongoose.model("shelters", ShelterSchema);
