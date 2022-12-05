//Expoting All Required Modules
const express = require("express");

// Mongoose
const mongoose = require("mongoose");

// Dotenv
const dotenv = require("dotenv");

// Cors
const cors = require("cors");

// Path
const path = require("path");

// Importing Authentication Routes
const userRoutes = require("./server/controllers/userController");

// Impoting Pet Routes
const petRoutes = require("./server/controllers/petController");

// Impoting Pet Routes
const shopRoutes = require("./server/controllers/shopController");

// Impoting Adoption Pet Routes
const petAdoptionRoutes = require("./server/controllers/petAdoptionController");

// Impoting Community Routes
const communityRoutes = require("./server/controllers/communityController");
// const { uploadFile } = require("./server/config/firebase");

//Setting Up Envionment Variables
dotenv.config();

//Creating Express App to Use Routes in Server
const app = express();
// ========================================================
// ========================================================
// ========================================================
// ========================================================
//MongoDB connection Using Mongoose
mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`Connected to DB successfull`.toUpperCase()))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

app.use(express.static(path.join(__dirname + "/Assets")));

app.get("/", (req, res) => {
  res.send(
    "<div style><h1>PETHUB.com</h1><p>Hello this is pethub.com api please refer to the API documentation for details</p>"
  );
});

app.use("/auth", userRoutes);

app.use("/pet", petRoutes);

app.use("/shop", shopRoutes);

app.use("/adoption", petAdoptionRoutes);

app.use("/community", communityRoutes);

const Port = process.env.PORT || 8000;
// Starting Server
app.listen(Port, () => {
  console.log(`Server Connected at ${Port}`.toUpperCase());
});
