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
// const firebaseAdmin = require("firebase-admin");
// const { v4: uuidv4 } = require("uuid");
// const serviceAccount = require("./server/config/pethub-ea211-firebase-adminsdk-a1nzj-5e7e3fd58f.json");

// const admin = firebaseAdmin.initializeApp({
//   credential: firebaseAdmin.credential.cert(serviceAccount),
// });

// const storageRef = admin.storage().bucket(`gs://pethub-ea211.appspot.com`);

// async function uploadFile(path, filename) {
//   // Upload the File
//   const storage = await storageRef.upload(path, {
//     public: true,
//     destination: `/uploads/hashnode/${filename}`,
//     metadata: {
//       firebaseStorageDownloadTokens: uuidv4(),
//     },
//   });

//   return storage[0].metadata.mediaLink;
// }
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
// app.use(express.bodyParser());
app.use(express.urlencoded());
app.use(cors());

app.use(express.static(path.join(__dirname + "/Assets")));

app.use("/auth", userRoutes);

app.use("/pet", petRoutes);

app.use("/shop", shopRoutes);

app.use("/adoption", petAdoptionRoutes);

app.use("/community", communityRoutes);

const Port = 8000;
// Starting Server
app.listen(Port, () => {
  console.log(`Server Connected at ${Port}`.toUpperCase());
});
