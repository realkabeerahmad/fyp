// Using Mongoose for Mongoo DB
const mongoose = require("mongoose");
// User Schema
const RoleSchema = mongoose.Schema({
  id: { type: String, required: true },
  middle_name: String,
  name: { type: String, required: true },
  desc: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
// Expoting User Model
module.exports = mongoose.model("roles", RoleSchema);
