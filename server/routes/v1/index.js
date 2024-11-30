const express = require("express");
const router = express.Router();
const user = require("./user");

router.use("/users/auth", user.router);

module.exports = { router };
