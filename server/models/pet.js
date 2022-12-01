// Using Mongoose for Mongoo DB
const mongoose = require("mongoose");
// Pet Schema
const PetSchema = mongoose.Schema({
  userId: String,
  shelterID: String,
  shelterName: String,
  name: String,
  bio: String,
  gender: String,
  breed: String,
  type: String,
  image: String,
  passport: String,
  dob: Date,
  rehome: Boolean,
  vaccination: {
    status: Boolean,
    address: String,
    DoseDate: Date,
    updatedAt: Date,
  },
  vet: {
    address: String,
    AppointmentDate: Date,
    updatedAt: { type: Date, default: Date.now },
  },
  mealTimes: [
    {
      name: String,
      time: Date,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  walkTimes: [
    {
      name: String,
      time: Date,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  gallery: [
    {
      image: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});
// Exporting Pet Model
module.exports = mongoose.model("pets", PetSchema);
