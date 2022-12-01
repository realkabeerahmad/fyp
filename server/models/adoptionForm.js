// Using Mongoose for Mongoo DB
const mongoose = require("mongoose");
// Pet Schema
const AdoptionFormSchema = mongoose.Schema({
  userId: String,
  petId: String,
  dob: Date,
  cnic: String,
  house_type: String,
  isYardFenced: String,
  createdAt: { type: Date, default: Date.now },
});
// Exporting Pet Model
module.exports = mongoose.model("adoptionForm", AdoptionFormSchema);
