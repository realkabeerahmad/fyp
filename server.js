const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
// const userRoutes = require("./server/controllers/userController");
// const petRoutes = require("./server/controllers/petController");
// const shopRoutes = require("./server/controllers/shopController");
// const petAdoptionRoutes = require("./server/controllers/petAdoptionController");
// const communityRoutes = require("./server/controllers/communityController");
const { router } = require("./server/routes/v1");
// const { uploadFile } = require("./server/config/firebase");

dotenv.config();

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

// app.use("/auth", userRoutes);

// app.use("/pet", petRoutes);

// app.use("/shop", shopRoutes);

// app.use("/adoption", petAdoptionRoutes);

// app.use("/community", communityRoutes);

app.use("/api/v1", router);

const Port = process.env.PORT || 8000;
// Starting Server
app.listen(Port, () => {
  console.log(`Server Connected at ${Port}`.toUpperCase());
});
