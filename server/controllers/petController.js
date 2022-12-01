// Express JS used to create Routes
const express = require("express");

// Multer to upload files
const upload = require("../config/multer");

// UUID V4 for generation Link
const { v4: uuidv4 } = require("uuid");

// Pet Model Created using MongoDB
const User = require("../models/user");

// Pet Model Created using MongoDB
const Pet = require("../models/pet");

// Using Router from Express JS to create exportable routes
const router = express.Router();

// Add a Pet
router.post("/addPet", upload.single("image"), (req, res) => {
  // Getting Data
  const obj = {
    userId: req.body.userId,
    name: req.body.name,
    bio: req.body.bio,
    gender: req.body.gender,
    breed: req.body.breed,
    type: req.body.type,
    image: req.file.filename,
    passport: req.body.passport,
    dob: req.body.dob,
    vaccination: {},
    rehome: false,
  };
  const _id = obj.userId;
  try {
    // Check if user Exist
    User.findById({ _id }, (err, user) => {
      if (user) {
        // Create an obj to store in DB
        const pet = new Pet(obj);
        // Save obj in DB
        pet
          .save()
          .then(() => {
            res.status(200).send({
              status: "success",
              message: "Pet Successfully Registered",
            });
          })
          .catch((err) => {
            throw Error("Unable to Register Pet\n" + err.message);
          });
      } else {
        throw Error("User Not Found");
      }
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      error: error.message,
    });
  }
});

// Show a Single Pet Details
router.post("/showPet", (req, res) => {
  var { _id } = req.body;
  try {
    Pet.findById({ _id: _id }, (err, data) => {
      if (data) {
        res.status(200).json({
          status: "success",
          message: "data fetched successfully",
          pet: data,
        });
      } else {
        res.send({ status: "failed", error: err.message });
      }
    }).clone();
  } catch (error) {
    res.status(400).json({ status: "failed", error: error.message });
  }
});

// Show a Single Pet Details
router.post("/deletePet", (req, res) => {
  const { _id } = req.body;
  try {
    Pet.findByIdAndDelete({ _id })
      .then(() => {
        res.send({ status: "success", message: "Pet Deleted Successfully" });
      })
      .catch((err) => {
        res.send({
          status: "failed",
          message: "Unable to Delete due to \n" + err,
        });
      });
  } catch (error) {
    res.status(400).json({ status: "failed", error: error.message });
  }
});

// Show All Pets of a User
router.post("/showAllPets", (req, res) => {
  const { userId } = req.body;
  try {
    Pet.find({ userId: userId }, (err, data) => {
      if (data !== [] || data !== null) {
        res.status(200).json({
          status: "success",
          message: "data fetched successfully",
          pets: data,
        });
      } else {
        res.json({
          status: "failed",
          message: "Pets not Found",
        });
      }
    }).clone();
  } catch (err) {
    res.status(500).json({ status: "failed", error: err.message });
  }
});

// Pet Rehome
router.post("/rehome", (req, res) => {
  var { petId } = req.body;
  try {
    pet.findByIdAndUpdate({ petId, rehome: true }, (err, data) => {
      if (data) {
        res.status(200).send({
          status: "success",
          message: "Pet Rehomed Succefully",
          data: data,
        });
      }
      throw Error("Error Occured");
    });
  } catch (error) {
    res.send({ status: "failed", message: error.message });
  }
});

// Add a Pet Meal Time
router.post("/addMealTime", (req, res) => {
  const { _id, name, time } = req.body;
  try {
    Pet.findByIdAndUpdate(
      { _id: _id },
      {
        $push: {
          mealTimes: { name: name, time: time, $sort: { createdAt: -1 } },
        },
      }
    )
      .then(() => {
        res
          .status(200)
          .send({ status: "success", message: "Meal Time Added Successfully" });
      })
      .catch((err) => {
        res.send({
          status: "failed",
          message: "Unable to Add Meal Time\n" + err.message,
        });
      });
  } catch (error) {
    res.status(500).json({ status: "failed", error: error.message });
  }
});

// Add a Pet Walk Time
router.post("/addWalkTime", (req, res) => {
  const { _id, name, time } = req.body;
  try {
    Pet.findByIdAndUpdate(
      { _id: _id },
      {
        $push: {
          walkTimes: { name: name, time: time, $sort: { createdAt: -1 } },
        },
      }
    )
      .then(() => {
        res
          .status(200)
          .send({ status: "success", message: "Walk Time Added Successfully" });
      })
      .catch((err) => {
        res.send({
          status: "failed",
          message: "Unable to Add Meal Time\n" + err.message,
        });
      });
  } catch (error) {
    res.status(500).json({ status: "failed", error: error.message });
  }
});

// Delete Pet Meal Time
router.post("/deleteMealTime", (req, res) => {
  const { _id, timeId } = req.body;
  try {
    Pet.findByIdAndUpdate(
      { _id: _id },
      { $pull: { mealTimes: { _id: timeId } } }
    )
      .then(() => {
        res.send({ status: "success", message: "Meal Time Deleted" });
      })
      .catch(() => {
        throw Error("Could not Delete");
      });
  } catch (error) {
    res.send({ status: "failed", message: error.message });
  }
});
// Delete Pet Walk Time
router.post("/deleteWalkTime", (req, res) => {
  const { _id, timeId } = req.body;
  try {
    Pet.findByIdAndUpdate(
      { _id: _id },
      { $pull: { walkTimes: { _id: timeId } } }
    )
      .then(() => {
        res.send({ status: "success", message: "Walk Time Deleted" });
      })
      .catch(() => {
        throw Error("Could not Delete");
      });
  } catch (error) {
    res.send({ status: "failed", message: error.message });
  }
});

// Add Pet Vaccination Details
router.post("/addVaccination", (req, res) => {
  const { _id, DoseDate, address, status } = req.body;
  try {
    Pet.updateOne(
      { _id: _id },
      {
        $set: {
          "vaccination.status": status,
          "vaccination.DoseDate": DoseDate,
          "vaccination.address": address,
          "vaccination.updatedAt": Date.now(),
        },
      }
    )
      .then((data) => {
        res.send({
          status: "success",
          message: "Vaccination Details Added",
          pet: data,
        });
      })
      .catch((err) => {
        res.send({
          status: "failed",
          message: "Error Occured\n" + err.message,
        });
      });
  } catch (err) {
    res.send({ status: "failed", message: err.message });
  }
});

// Update Pet Vaccination Date
router.post("/updateVaccinationDate", (req, res) => {
  const { _id, DoseDate } = req.body;
  try {
    Pet.updateOne(
      { _id: _id },
      {
        $set: {
          "vaccination.DoseDate": DoseDate,
          "vaccination.updatedAt": Date.now(),
        },
      }
    )
      .then(() => {
        res.send({ status: "success", message: "Vaccination Date Updated" });
      })
      .catch((err) => {
        res.send({
          status: "failed",
          message: "Error Occured\n" + err.message,
        });
      });
  } catch (err) {
    res.send({ status: "failed", message: err.message });
  }
});

// Add Pet Vet Details
router.post("/addVet", (req, res) => {
  const { _id, AppointmentDate, address } = req.body;
  try {
    Pet.updateOne(
      { _id: _id },
      {
        $set: {
          "vet.AppointmentDate": AppointmentDate,
          "vet.address": address,
          "vet.updatedAt": Date.now(),
        },
      }
    )
      .then(() => {
        res.send({ status: "success", message: "Vet Details Added" });
      })
      .catch((err) => {
        res.send({
          status: "failed",
          message: "Error Occured\n" + err.message,
        });
      });
  } catch (err) {
    res.send({ status: "failed", message: err.message });
  }
});

// Update Pet Vaccination Date
router.post("/updateVetDate", (req, res) => {
  const { _id, AppointmentDate } = req.body;
  try {
    Pet.updateOne(
      { _id: _id },
      {
        $set: {
          "vet.AppointmentDate": AppointmentDate,
          "vaccination.updatedAt": Date.now(),
        },
      }
    )
      .then(() => {
        res.send({
          status: "success",
          message: "Vet Appointment Date Updated",
        });
      })
      .catch((err) => {
        res.send({
          status: "failed",
          message: "Error Occured\n" + err.message,
        });
      });
  } catch (err) {
    res.send({ status: "failed", message: err.message });
  }
});

// Add a Pet Image
router.post("/addImage", upload.single("image"), (req, res) => {
  const { _id } = req.body;
  const obj = { image: req.file.filename };
  try {
    Pet.findByIdAndUpdate(
      { _id: _id },
      {
        $push: {
          gallery: { image: obj.image, $sort: { createdAt: -1 } },
        },
      }
    )
      .then(() => {
        res
          .status(200)
          .send({ status: "success", message: "Image Added Successfully" });
      })
      .catch((err) => {
        res.send({
          status: "failed",
          message: "Unable to Add Image\n" + err.message,
        });
      });
  } catch (error) {
    res.status(500).json({ status: "failed", error: error.message });
  }
});

// Delete Pet Meal Time
router.post("/deleteImage", (req, res) => {
  const { _id, imageId } = req.body;
  try {
    Pet.findByIdAndUpdate(
      { _id: _id },
      { $pull: { gallery: { _id: imageId } } }
    )
      .then(() => {
        res.send({ status: "success", message: "Image Deleted" });
      })
      .catch(() => {
        throw Error("Could not Delete");
      });
  } catch (error) {
    res.send({ status: "failed", message: error.message });
  }
});

// Exporting Routes
module.exports = router;
