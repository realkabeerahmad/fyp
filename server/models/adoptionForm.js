// Using Mongoose for Mongoo DB
const mongoose = require("mongoose");
// Pet Schema
const AdoptionFormSchema = mongoose.Schema({
  user: {
    _id: String,
    name: String,
    dob: Date,
    cnic: String,
    email: String,
    phone: String,
  },
  shelterId: String,
  status: { type: String, default: "Pending" },
  pet: { _id: String, name: String },
  createdAt: { type: Date, default: Date.now },
});
// Exporting Pet Model
module.exports = mongoose.model("adoptionForm", AdoptionFormSchema);
