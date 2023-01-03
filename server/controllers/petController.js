// Express JS used to create Routes
const express = require("express");

// Pet Model Created using MongoDB
const User = require("../models/user");

// Pet Model Created using MongoDB
const Pet = require("../models/pet");

// Using Router from Express JS to create exportable routes
const router = express.Router();

// Add a Pet
router.post("/add", (req, res) => {
  // Getting Data
  var { userId, name, bio, gender, breed, type, image, passport, age } =
    req.body;
  var _id = userId;
  try {
    // Check if user Exist
    User.findById({ _id }, (err, data) => {
      if (data) {
        var obj = {};
        if (data.isShelter) {
          obj = {
            user: { _id: data._id, name: data.name },
            shelter: { _id: data._id, name: data.name },
            name: name,
            bio: bio,
            gender: gender,
            breed: breed,
            type: type,
            image: image,
            passport: passport ? passport : "",
            age: age,
            rehome: false,
          };
          // const pet = new Pet(obj);
        } else {
          obj = {
            user: { _id: data._id, name: data.name },
            name: name,
            bio: bio,
            gender: gender,
            breed: breed,
            type: type,
            image: image,
            passport: passport ? passport : "",
            age: age,
            rehome: false,
          };
          // const pet = new Pet(obj);
        }
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
            res.status(200).send({
              status: "failed",
              message: "Unable to Register Pet\n" + err.message,
            });
            // throw Error();
          });
      } else {
        res.status(200).send({
          status: "failed",
          message: "User not found",
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

// Edit Pet Details
router.post("/edit", (req, res) => {
  const { _id, breed, bio, gender, age, passport, image } = req.body;
  try {
    Pet.findByIdAndUpdate(
      { _id: _id },
      {
        breed: breed.label,
        bio: bio,
        gender: gender,
        age: age,
        passport: passport,
      }
    )
      .then(() => {
        res.send({
          status: "success",
          message: "Pet info Updated Successfully",
        });
      })
      .catch((err) => {
        res.send({ status: "failed", message: "Pet not Updated" });
      });
  } catch (error) {
    res.send({ status: "failed", message: error.message });
  }
});

// Show a Single Pet Details
router.post("/show", (req, res) => {
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

// Show All Pets
router.get("/show/all", (req, res) => {
  try {
    Pet.find({}, (err, data) => {
      if (data) {
        res.status(200).json({
          status: "success",
          message: "data fetched successfully",
          pets: data,
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
router.post("/delete", (req, res) => {
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
router.post("/user/show", (req, res) => {
  const { userId } = req.body;
  try {
    Pet.find({ "user._id": userId }, (err, data) => {
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
  var { _id } = req.body;
  try {
    Pet.findByIdAndUpdate({ _id: _id }, { rehome: true }, (err, data) => {
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
router.post("/meal/add", (req, res) => {
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
router.post("/walk/add", (req, res) => {
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
router.post("/meal/delete", (req, res) => {
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
router.post("/walk/delete", (req, res) => {
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
router.post("/vaccination/add_new", (req, res) => {
  const { _id, DoseDate, address, DoseName } = req.body;
  // console.log(req.body);
  console.log(_id);
  try {
    Pet.findByIdAndUpdate(
      { _id: _id },
      {
        vaccination: {
          DoseName: DoseName,
          DoseDate: DoseDate,
          address: address,
          updatedAt: Date.now(),
        },
      }
    )
      .then(() => {
        res.send({
          status: "success",
          message: "Vaccination Details Added",
          // pet: data,
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

// Mark Vaccination as Done
router.post("/vaccination/MarkAsDone", (req, res) => {
  const { _id } = req.body;
  try {
    Pet.findById({ _id: _id })
      .then((data) => {
        if (data.vaccination) {
          Pet.findByIdAndUpdate(
            { _id: _id },
            {
              $push: {
                vaccination_history: {
                  DoseName: data.vaccination.DoseName,
                  DoseDate: data.vaccination.DoseDate,
                  address: data.vaccination.address,
                },
              },
              $set: {
                "vaccination.DoseName": "",
                "vaccination.DoseDate": "",
                "vaccination.address": "",
              },
            }
          )
            .then(() => {
              res.send({
                status: "success",
                message: "Marked as Done",
              });
            })
            .catch((err) => {
              res.send({
                status: "failed",
                message: "Error Occured\n" + err.message,
              });
            });
        } else {
          res.send({
            status: "failed",
            message: "Vaccination not Found",
          });
        }
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
router.post("/vaccination/update_date", (req, res) => {
  const { _id, DoseDate, DoseName } = req.body;
  try {
    Pet.updateOne(
      { _id: _id },
      {
        $set: {
          "vaccination.DoseName": DoseName,
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
router.post("/vet/add_appointment", (req, res) => {
  const { _id, reason, AppointmentDate, address } = req.body;
  try {
    Pet.updateOne(
      { _id: _id },
      {
        $set: {
          "vet.reason": reason,
          "vet.AppointmentDate": AppointmentDate,
          "vet.address": address,
          "vet.updatedAt": Date.now(),
          "vet.history": [],
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

// Mark Vet Appointment as Done
router.post("/vet/MarkAsDone", (req, res) => {
  const { _id } = req.body;
  try {
    Pet.findById({ _id: _id })
      .then((data) => {
        if (data.vet) {
          Pet.findByIdAndUpdate(
            { _id: _id },
            {
              $push: {
                vet_history: {
                  reason: data.vet.reason,
                  AppointmentDate: data.vet.AppointmentDate,
                  address: data.vet.address,
                },
              },
              $set: {
                "vet.reason": "",
                "vet.AppointmentDate": "",
                "vet.address": "",
              },
            }
          )
            .then(() => {
              res.send({
                status: "success",
                message: "Appointment Marked as Done",
              });
            })
            .catch((err) => {
              res.send({
                status: "failed",
                message: "Error Occured\n" + err.message,
              });
            });
        }
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

// Update Pet Vet Appointment Date
router.post("vet/update_appointment", (req, res) => {
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
router.post("/gallery/add", (req, res) => {
  const { _id, image } = req.body;
  // const obj = { image: req.file.filename };
  try {
    Pet.findByIdAndUpdate(
      { _id: _id },
      {
        $push: {
          gallery: { image: image, $sort: { createdAt: -1 } },
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
router.post("/gallery/delete", (req, res) => {
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

router.post("/wish", async (req, res) => {
  const { userId, _id } = req.body;
  const p = await Pet.findById({ _id: _id });
  User.find({ _id: userId, pet_wish: { $elemMatch: { _id: _id } } })
    .then((data) => {
      if (data.length > 0) {
        // res.send({ status: "failed", message: "Already in WishList" });
        User.findByIdAndUpdate(
          { _id: userId },
          // { new: true },
          {
            $pull: {
              pet_wish: { _id: p._id },
            },
          }
        )
          .then(async () => {
            const user = await User.findById({ _id: userId });
            res.send({
              status: "success",
              message: "Removed from WishList",
              data: user,
            });
          })
          .catch((err) => {
            res.send({ status: "failed", message: err.message });
          });
      } else {
        User.findByIdAndUpdate(
          { _id: userId },
          // { new: true },
          {
            $push: {
              pet_wish: { _id: p._id, name: p.name, image: p.Image },
            },
          }
        )
          .then(async () => {
            const user = await User.findById({ _id: userId });
            res.send({
              status: "success",
              message: "Added to WishList",
              data: user,
            });
          })
          .catch((err) => {
            res.send({ status: "failed", message: err.message });
          });
      }
    })
    .catch((err) => {
      res.send({ status: "failed", message: err.message });
    });
  // user.findByIdAndUpdate();
});

// Exporting Routes
module.exports = router;
