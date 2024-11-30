const express = require("express");
const router = express.Router();
const userController = require("../../controllers/v1/user");

router.post("/register", userController.Register);
router.get("/get:_id", userController.GetUserByID);
router.get("/all", userController.GetAllUsers);

module.exports = { router };
