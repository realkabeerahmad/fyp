// Using Mongoose for Mongoo DB
const mongoose = require("mongoose");
// User OTP Schema Model
const userOTPSchema = new mongoose.Schema({
  userID: String,
  otp: String,
  createdAt: Date,
  expiredAt: Date,
});
// Exporting User OTP Model
module.exports = mongoose.model("UserOtpVerification", userOTPSchema);
