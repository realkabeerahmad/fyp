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
  vaccination: {
    history: [
      {
        DoseName: String,
        address: String,
        DoseDate: Date,
        updatedAt: Date,
      },
    ],
    DoseName: String,
    address: String,
    DoseDate: Date,
    updatedAt: Date,
  },
  vet: {
    history: [
      {
        reason: String,
        address: String,
        AppointmentDate: Date,
        updatedAt: { type: Date, default: Date.now },
        default: Array,
      },
    ],
    reason: String,
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

PetSchema.index({ name: "text", gender: "text", type: "text" });
// Exporting Pet Model
module.exports = mongoose.model("pets", PetSchema);
