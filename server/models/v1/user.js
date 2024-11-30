// Using Mongoose for Mongoo DB
const mongoose = require("mongoose");
// User Schema
const UserSchema = mongoose.Schema({
  first_name: { type: String, required: true },
  middle_name: String,
  last_name: { type: String, required: true },
  cnic: String,
  dob: Date,
  address: { type: String, required: false },
  city: { type: String, required: false },
  state: { type: String, required: false },
  country: { type: String, required: false },
  gender: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  is_active: { type: Boolean, default: true },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "roles",
  },
  createdAt: { type: Date, default: Date.now },
});
// Expoting User Model
module.exports = mongoose.model("users", UserSchema);
