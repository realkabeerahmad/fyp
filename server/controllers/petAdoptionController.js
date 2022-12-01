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

// Shelter Details Model
const shelter = require("../models/shelter");

// Adoption Form Model
const adoptionForm = require("../models/adoptionForm");
const user = require("../models/user");

// Using Router from Express JS to create exportable routes
const router = express.Router();

// Add a Shelter
router.post("/addShelter", (req, res) => {
  const { name, description, address, RegistrationNo } = req.body;
  const obj = { name, description, address, RegistrationNo };
  try {
    shelter.findOne({ RegistrationNo: RegistrationNo }, async (err, data) => {
      if (data) {
        res.send({ status: "failed", message: "Shelter Already Registered" });
      } else if (err) {
        res.send({ status: "failed", message: err.message });
      } else {
        const Shelter = new shelter(obj);
        await Shelter.save();
        res.status(200).send({
          status: "success",
          message: "Shelter Registered Successfully",
        });
      }
    });
  } catch (error) {
    res.send({ status: "failed", message: error.message });
  }
});

// Show All Shlters
router.get("/showAllShelters", (req, res) => {
  try {
    shelter.find({}, (err, data) => {
      if (data) {
        res.status(200).send({
          status: "success",
          message: "Sent Successfully",
          shelters: data,
        });
      } else {
        throw Error("Error Occured \n", err.message);
      }
    });
  } catch (error) {
    res.send({ status: "failed", message: error.message });
  }
});

// Add a Pet
router.post("/addPet", upload.single("image"), (req, res) => {
  // Getting Data
  const obj = {
    shelterID: req.body.shelterID,
    name: req.body.name,
    bio: req.body.bio,
    gender: req.body.gender,
    breed: req.body.breed,
    type: req.body.type,
    image: req.file.filename,
    passport: req.body.passport,
    dob: req.body.dob,
    rehome: true,
    shelterName: "",
  };
  // const _id = "'" + obj.shelterID + "'";
  const _id = obj.shelterID;
  console.log(_id);
  try {
    // Check if user Exist
    shelter.findById({ _id }, (err, data) => {
      if (data) {
        console.log(obj.name);
        obj.shelterName = data.name;
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
            res.json({
              status: "failed",
              error: "Unable to Register\n" + err.message,
            });
          });
      } else {
        res.json({
          status: "failed",
          error: "Shelter Not Found",
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      error: error.message,
    });
  }
});

// Show All Pets
router.get("/showAllPets", (req, res) => {
  try {
    Pet.find({ rehome: true }, (err, data) => {
      if (data) {
        res.status(200).send({
          status: "success",
          message: "Sent Successfully",
          pets: data,
        });
      } else {
        throw Error("Error Occured \n", err.message);
      }
    }).sort({ createdAt: -1 });
  } catch (error) {
    res.send({ status: "failed", message: error.message });
  }
});

router.post("/adoptPet", (req, res) => {
  const { petId, userId, dob, cnic, gender, house_type, isYardFenced } =
    req.body;
  const userObj = {
    dob: dob,
    cnic: cnic,
    gender: gender,
  };
  const appObj = {
    userId: userId,
    petId: petId,
    dob: dob,
    cnic: cnic,
    house_type: house_type,
    isYardFenced: isYardFenced,
  };
  user
    .findByIdAndUpdate({ _id: userId }, userObj)
    .then((user) => {
      adoptionForm.findOne({ userId: userId }, (err, form) => {
        if (form) {
          res.send({
            status: "failed",
            message: "Application already submitted",
          });
        } else {
          const AdoptForm = new adoptionForm(appObj);
          AdoptForm.save()
            .then(() => {
              res.send({
                status: "success",
                message: "Application submitted Successfully",
              });
            })
            .catch(() => {
              console.log("application not saved");
              res.send({ status: "failed", message: "Error Occured" });
            });
        }
      });
    })
    .catch(() => {
      res.send({ status: "failed", message: "Error Occured" });
    });
});

module.exports = router;
