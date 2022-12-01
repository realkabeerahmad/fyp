// bcrypt-nodejs used for Password Encription and Decription
const bcrypt = require("bcrypt-nodejs");

// to Read Enviorment Variables
const dotenv = require("dotenv");

// Express JS used to create Routes
const express = require("express");

// User Model Created using MongoDB
const User = require("../models/user");

// Using Router from Express JS to create exportable routes
const router = express.Router();

// User OTP verification model
const userOtpVerification = require("../models/userOtpVerification");

// Setting Up Envionment Variables
dotenv.config();

// Import Transpoter
const transporter = require("../config/transporter");

// Import Multer Storage
const Upload = require("../config/multer");

//Cart Model
const cart = require("../models/cart");

const uploadFile = require("../config/firebase");

// Register route for Creating a new user
router.post("/register", (req, res) => {
  // Getting all required data from request body
  var { firstName, lastName, email, password } = req.body;
  // Generating Salt using genSaltSync function with 10 rounds
  const salt = bcrypt.genSaltSync(10);
  // Check if email already exist in DB
  try {
    User.findOne({ email: email }, (err, user) => {
      if (user) {
        res.json({ status: "failed", message: "User Already Exist" });
      } else if (err) {
        res.json({ status: "failed", message: "Server Error" });
      } else {
        // Creating a user object to save in database
        const user = new User({
          firstName,
          lastName,
          email,
          password,
          Image: "newUser.png",
        });
        // Hashing users password
        bcrypt.hash(user.password, salt, null, async (err, hash) => {
          if (err) {
            throw Error(err.message);
          }
          // Storing HASH Password in user object
          user.password = hash;
          // Storing user in our Database
          await user
            .save()
            .then((result) => {
              SendOtpVerificationEmail(result, res);
            })
            .catch(() => {
              res.json({ status: "failed", message: "Unable to Registered" });
            });
        });
      }
    });
  } catch (error) {
    res.json({ status: "failed", message: error.message });
  }
});

// Show User route
router.post("/showUser", (req, res) => {
  const { _id } = req.body;
  try {
    User.findById({ _id }, (err, user) => {
      if (user) {
        res.status(200).send({
          status: "success",
          message: "User updated successfully",
          user: user,
        });
      } else {
        res.status(200).send({
          status: "failed",
          message: "User not updated",
        });
      }
    });
  } catch (error) {
    res.json({ status: "failed", error: error.message });
  }
});

// Show All Users route
router.get("/showAllUser", (req, res) => {
  try {
    User.find({}, (err, users) => {
      if (users) {
        res.status(200).send({
          status: "success",
          message: "All Users sent successfully",
          users: users,
        });
      } else {
        res.status(200).send({
          status: "failed",
          message: "User not updated",
        });
      }
    });
  } catch (error) {
    res.json({ status: "failed", error: error.message });
  }
});

// Login route to allow registered users to login
router.post("/login", (req, res) => {
  // Getting all required data from request body
  const { email, password } = req.body;
  // Checking if User exist
  try {
    User.findOne({ email: email }, (err, user) => {
      if (user) {
        if (user.verified) {
          // Decrypting and comparing Password
          const validPassword = bcrypt.compareSync(password, user.password);
          if (validPassword) {
            res.status(200).json({
              status: "success",
              message: "Valid Password",
              user: user,
            });
          } else {
            res.status(200).json({
              status: "failed",
              message: "Invalid Password",
              user: user,
            });
          }
        } else {
          res.status(200).json({
            status: "pending",
            message: "Please Verify Your Email",
            user: user,
          });
        }
      } else {
        res.status(200).json({ message: "User do not Exist" });
      }
    });
  } catch (error) {
    res.json({ status: "failed", error: error.message });
  }
});

// Verify OTP route
router.post("/verifyOTP", async (req, res) => {
  try {
    // Get data from Request body
    const { userID, otp } = req.body;
    console.log(userID);
    // Check OTP Details
    if (!userID || !otp) {
      throw Error("Empty otp Details are not allowed");
    } else {
      // Find OTP
      const userVerificationRecords = await userOtpVerification.find({
        userID,
      });
      if (userVerificationRecords.length <= 0) {
        res.send({
          status: "failed",
          message:
            "Account record doesn't exist or has been verified already. Please Signup or Login.",
        });
      } else {
        const { expiredAt } = userVerificationRecords[0];
        const hashedOTP = userVerificationRecords[0].otp;
        // Check if Expired
        if (expiredAt < Date.now()) {
          await userOtpVerification.deleteMany({ userID });
          res.send({
            status: "failed",
            message: "Code has Expired. Please request again.",
          });
        } else {
          // Check OTP
          const validotp = bcrypt.compareSync(otp, hashedOTP);
          if (!validotp) {
            res.send({
              status: "failed",
              message: "Invalid OTP please check your Email.",
            });
          } else {
            // Update User Status
            await User.findByIdAndUpdate(
              { _id: userID },
              { verified: true }
            ).then(() => {
              userOtpVerification.deleteMany({ userID }).then(() => {
                res.json({
                  status: "success",
                  message: "User Email Verified successfully.",
                });
              });
            });
          }
        }
      }
    }
  } catch (error) {
    res.json({
      status: "failed",
      message: error.message,
    });
  }
});
// Add User Image
router.post("/updateProfileImage", Upload.single("image"), (req, res) => {
  const { userId } = req.body;
  const obj = { Image: req.file };
  const path = req.body.path;
  // Grab the file
  const file = req.file;
  // Format the filename
  const timestamp = Date.now();
  const name = file.originalname.split(".")[0];
  const type = file.originalname.split(".")[1];
  const fileName = `${name}_${timestamp}.${type}`;
  (async () => {
    // const url = await uploadFile('./mypic.png', "my-image.png");
    const url = await uploadFile(path + file.originalname, fileName);
    console.log(url);
  })();
  // console.log(file);
  res.send("done");
  // try {
  //   User.findByIdAndUpdate({ _id: userId }, { Image: obj.Image })
  //     .then(() => {
  //       res.status(200).json({
  //         status: "success",
  //         message: "Image Added successfully",
  //         data: userId,
  //       });
  //     })
  //     .catch((err) => {
  //       throw Error("Unable to update Image" + err.message);
  //     });
  // } catch (error) {
  //   res.json({
  //     status: "failed",
  //     error: error.message,
  //   });
  // }
});

// Re-send OTP route
router.post("/reSendOtpVerificatioCode", async (req, res) => {
  try {
    // Get Data from Request Body
    let { userID, email } = req.body;
    console.log(userID);
    //Check if Data is Correct
    if (!userID || !email) {
      throw Error("Empty user Details are not allowed");
    } else {
      // Delete old OTP Generated
      await userOtpVerification.deleteMany({ userID });
      // Call Send OTP Function
      console.log(userID);
      SendOtpVerificationEmail({ _id: userID, email }, res);
    }
  } catch (error) {
    res.send({
      status: "failed",
      message: error.message,
    });
  }
});

// Send OTP Function
const SendOtpVerificationEmail = async ({ _id, email }, res) => {
  console.log(_id);
  try {
    // Generated OTP
    const otp = Math.floor(1000 + Math.random() * 9000);
    // Mail Options
    const mailOptions = {
      from: "otp.pethub@zohomail.com",
      to: email,
      subject: "Verify your Email",
      text: "OTP Verification Email",
      html: `
      <h2>Hello and Welcome to <span style="color:#e92e4a;">pethub.com</span></h2>
      <p>Your OTP verification code is <span style="color:#e92e4a; font-size:20px;">${otp}</span></p>.
      <p>Enter this code in our website or mobile app to activate your account.</p>
      <br/>
      <p>If you have any questions, send us an email <span style="color:blue;">support.pethub@zohomail.com</span>.</p>
      <br/>
      <p>We’re glad you’re here!</p>
      <p style="color:#e92e4a;">The PETHUB team</p>`,
    };

    //hash the OTP
    const saltRounds = 10;

    // generating salt
    const salt = bcrypt.genSaltSync(saltRounds);

    // getting Hashed OTP
    const hashedOTP = bcrypt.hashSync(otp, salt);

    //OTP Verification DB object
    const newOtpVerfication = new userOtpVerification({
      userID: _id,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiredAt: Date.now() + 3600000,
    });
    await newOtpVerfication.save();
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return res.send({
          status: "failed",
          error: "Not able to send OTP",
        });
      }
      return res.send({
        status: "pending",
        message: "Verification OTP email sent.",
        data: {
          userId: _id,
          email,
        },
      });
    });
  } catch (error) {
    res.json({
      status: "failed",
      message: error.message,
    });
  }
};

// Expoting Routes
module.exports = router;
