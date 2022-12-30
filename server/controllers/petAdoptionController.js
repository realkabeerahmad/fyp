// Express JS used to create Routes
const express = require("express");

// Multer to upload files
const upload = require("../config/multer");

const bcrypt = require("bcrypt-nodejs");

// Pet Model Created using MongoDB
const Pet = require("../models/pet");

// Shelter Details Model
const shelter = require("../models/shelter");

// Adoption Form Model
const adoptionForm = require("../models/adoptionForm");
const user = require("../models/user");
const pet = require("../models/pet");

// Using Router from Express JS to create exportable routes
const router = express.Router();

// Add a Shelter
router.post("/shelter/add", (req, res) => {
  const { name, description, address, RegistrationNo, email, phone, password } =
    req.body;
  const obj = {
    name,
    description,
    address,
    RegistrationNo,
    email,
    phone,
    Image: "https://i.ibb.co/Lk9vMV2/newUser.png",
  };
  const salt = bcrypt.genSaltSync(10);
  var shelterUser = {
    _id: "",
    name,
    email,
    password,
    Image: "https://i.ibb.co/Lk9vMV2/newUser.png",
    isShelter: true,
  };
  try {
    shelter.findOne({ email: email }, async (err, data) => {
      if (data) {
        res.send({ status: "failed", message: "Shelter Already Registered" });
      } else if (err) {
        res.send({ status: "failed", message: err.message });
      } else {
        bcrypt.hash(shelterUser.password, salt, null, async (err, hash) => {
          if (err) {
            console.log(err);
          } else {
            shelterUser.password = hash;
            const Shelter = new shelter(obj);
            Shelter.save().then(async (shelter) => {
              shelterUser._id = shelter._id;
              const User = new user(shelterUser);
              await User.save();
              res.status(200).send({
                status: "success",
                message: "Shelter Registered Successfully",
              });
            });
          }
        });
      }
    });
  } catch (error) {
    res.send({ status: "failed", message: error.message });
  }
});
// Show All Shlters
router.get("/shelters/show/all", (req, res) => {
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
// Show All Pets
router.get("/adopt/show/all", (req, res) => {
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
// Adopt Pet
router.post("/adopt", async (req, res) => {
  const { petId, shelterId, userId, dob, cnic, gender, phone } = req.body;
  const Pet = await pet.findById({ _id: petId });
  const User = await user.findById({ _id: userId });
  const userObj = {
    dob: dob,
    cnic: cnic,
    gender: gender,
    phone: phone,
  };
  const appObj = {
    user: {
      _id: userId,
      name: User.name,
      email: User.email,
      dob: dob,
      cnic: cnic,
      phone: phone,
    },
    shelterId: shelterId,
    pet: {
      _id: petId,
      name: Pet.name,
    },
  };
  console.log(appObj);
  user
    .findByIdAndUpdate({ _id: userId }, userObj)
    .then((user) => {
      adoptionForm.findOne(
        { "user._id": userId, "pet._id": petId },
        (err, form) => {
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
        }
      );
    })
    .catch(() => {
      res.send({ status: "failed", message: "Error Occured" });
    });
});
// Show Shelter Applications
router.post("/applications/show/shelters", (req, res) => {
  const { shelterId } = req.body;
  adoptionForm.find({ shelterId: shelterId }, (err, data) => {
    if (data) {
      res.send({ status: "success", data: data });
    } else {
      res.send({ status: "failed", data: [] });
    }
  });
});
// Show Shelter Applications
router.post("/applications/status", (req, res) => {
  const { shelterId, _id, status } = req.body;
  adoptionForm.find({ _id: _id, shelterId: shelterId }, (err, data) => {
    if (data) {
      adoptionForm
        .findByIdAndUpdate({ _id: _id }, { status: status })
        .then(() => {
          res.send({ status: "success", message: "Status Updated" });
        })
        .catch((err) => {
          res.send({ status: "failed", message: err.message });
        });
    } else {
      res.send({ status: "failed", message: "Application not found" });
    }
  });
});
// Show user Applications
router.post("/applications/show/user", (req, res) => {
  const { userId } = req.body;
  adoptionForm.find({ userId: userId }, (err, data) => {
    if (data) {
      res.send({ status: "success", data: data });
    } else {
      res.send({ status: "failed", data: [] });
    }
  });
});

module.exports = router;
