const bcrypt = require("bcrypt-nodejs");
const dotenv = require("dotenv");
// const express = require("express");
// const router = express.Router();

const User = require("../../models/v1/user");

// User OTP verification model
// const userOtpVerification = require("../../models/userOtpVerification");

// Setting Up Envionment Variables
dotenv.config();

// Import Transpoter
// const transporter = require("../config/transporter");

// Import Multer Storage
// const Upload = require("../config/multer");

//Cart Model
// const cart = require("../models/cart");

// const uploadFile = require("../config/firebase");

class HTTPSTATUS {
  static STATUS = {
    OK: { CODE: 200, REASON: "OK" },
    CREATED: { CODE: 201, REASON: "CREATED" },
    INTERNAL_SERVER_ERROR: { CODE: 500, REASON: "INTERNAL_SERVER_ERROR" },
    BAD_GATEWAY: { CODE: 502, REASON: "BAD_GATEWAY" },
    BAD_REQUEST: { CODE: 400, REASON: "BAD_REQUEST" },
    UNAUTHORIZED: { CODE: 401, MESSAGE: "Unauthorized" },
    FORBIDDEN: { CODE: 403, MESSAGE: "Forbidden" },
    NOT_FOUND: { CODE: 404, REASON: "NOT_FOUND" },
  };
}
// Register route for Creating a new user
const Register = async (req, res) => {
  var {
    first_name,
    middle_name,
    last_name,
    cnic,
    dob,
    address,
    city,
    state,
    country,
    gender,
    email,
    password,
    is_active,
    role,
  } = req.body;

  const salt = bcrypt.genSaltSync(10);

  try {
    const isUserExisting = await User.findOne({ email });
    if (isUserExisting) {
      res.status(HTTPSTATUS.STATUS.BAD_REQUEST.CODE).json({
        status: HTTPSTATUS.STATUS.BAD_REQUEST.REASON,
        message: "User already exists",
        date: undefined,
      });
    } else {
      const hash = bcrypt.hashSync(password, salt);
      const user = new User({
        first_name,
        middle_name,
        last_name,
        cnic,
        dob,
        address,
        city,
        state,
        country,
        gender,
        email,
        password: hash,
        is_active,
        role,
      });
      const savedUser = await user.save();
      res.status(HTTPSTATUS.STATUS.CREATED.CODE).json({
        status: HTTPSTATUS.STATUS.OK.CREATED,
        message: "User created successfully",
        date: savedUser,
      });
    }
  } catch (error) {
    console.log(error);

    res.status(HTTPSTATUS.STATUS.BAD_REQUEST.CODE).json({
      status: HTTPSTATUS.STATUS.BAD_REQUEST.REASON,
      message: "Error creating user " + error,
      date: "",
    });
  }
};

const GetUserByID = async (req, res) => {
  const { _id } = req.params;
  try {
    const user = await User.findById({ _id }).populate({
      path: "role",
      select: "_id id",
    });
    if (user) {
      res.status(HTTPSTATUS.STATUS.OK.CODE).json({
        status: HTTPSTATUS.STATUS.OK.REASON,
        message: "User Fetched",
        date: user,
      });
    } else
      res.status(HTTPSTATUS.STATUS.NOT_FOUND.CODE).json({
        status: HTTPSTATUS.STATUS.NOT_FOUND.REASON,
        message: "User NOT FOUND",
        date: undefined,
      });
  } catch (error) {
    res.status(HTTPSTATUS.STATUS.BAD_REQUEST.CODE).json({
      status: HTTPSTATUS.STATUS.BAD_REQUEST.REASON,
      message: "Error Fetching user" + error,
      date: undefined,
    });
  }
};

const GetAllUsers = (req, res) => {
  try {
    User.find({}, (err, users) => {
      if (err) throw Error(err);
      else if (users)
        res.status(HTTPSTATUS.STATUS.OK.CODE).json({
          status: HTTPSTATUS.STATUS.OK.REASON,
          message: "All Users sent OKfully",
          users: users,
        });
      else
        res.status(HTTPSTATUS.STATUS.NOT_FOUND.CODE).json({
          status: HTTPSTATUS.STATUS.NOT_FOUND.REASON,
          message: "User not updated",
        });
    });
  } catch (error) {
    res.status(HTTPSTATUS.STATUS.BAD_REQUEST.CODE).json({
      status: HTTPSTATUS.STATUS.BAD_REQUEST.REASON,
      message: "",
      date: "",
    });
  }
};

// Login route to allow registered users to login
// router.post("/login", (req, res) => {
//   // Getting all required data from request body
//   const { email, password } = req.body;
//   // Checking if User exist
//   try {
//     User.findOne({ email: email }, (err, user) => {
//       if (user) {
//         if (user.verified) {
//           // Decrypting and comparing Password
//           const validPassword = bcrypt.compareSync(password, user.password);
//           if (validPassword) {
//             res.send({
//               status: "OK",
//               message: "Valid Password",
//               user: user,
//             });
//           } else {
//             res.send({
//               status: "failed",
//               message: "BAD_REQUEST Password",
//               user: user,
//             });
//           }
//         } else {
//           res.send({
//             status: "pending",
//             message: "Please Verify Your Email",
//             user: user,
//           });
//         }
//       } else {
//         res.send({ status: "failed", message: "User do not Exist" });
//       }
//     });
//   } catch (error) {
//     res.json({ status: "failed", error: error.message });
//   }
// });

module.exports = { Register, GetUserByID, GetAllUsers };
