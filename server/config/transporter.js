// Require Nodemailer to send Emails
const nodemailer = require("nodemailer");

// to Read Enviorment Variables
const dotenv = require("dotenv");

//Setting Up Envionment Variables
dotenv.config();

// Creating Nodemailer Transporter to Send Emails
const transporter = nodemailer.createTransport({
  host: process.env.HOST,
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
  tls: {
    ciphers: "SSLv3",
  },
});

// Exporting Transporter for Use
module.exports = transporter;
