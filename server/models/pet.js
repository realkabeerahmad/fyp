// Using Mongoose for Mongoo DB
const mongoose = require("mongoose");
// Pet Schema
const PetSchema = mongoose.Schema({
  user: {
    _id: String,
    name: String,
  },
  shelter: {
    _id: String,
    name: String,
  },
  name: { type: String, index: true },
  bio: String,
  gender: { type: String, index: true },
  breed: String,
  type: { type: String, index: true },
  image: String,
  passport: String,
  age: String,
  rehome: Boolean,
  vaccination_history: [
    {
      DoseName: String,
      address: String,
      DoseDate: { type: Date, default: null },
      updatedAt: { type: Date, default: Date.now },
    },
  ],
  vaccination: {
    DoseName: String,
    address: String,
    DoseDate: { type: Date, default: null },
    updatedAt: Date,
  },
  vet_history: [
    {
      reason: String,
      address: String,
      AppointmentDate: { type: Date, default: null },
      updatedAt: { type: Date, default: Date.now },
      default: Array,
    },
  ],
  vet: {
    reason: String,
    address: String,
    AppointmentDate: { type: Date, default: null },
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

PetSchema.index({ name: "text", gender: "text", type: "text", breed: "text" });
// Exporting Pet Model
module.exports = mongoose.model("pets", PetSchema);
