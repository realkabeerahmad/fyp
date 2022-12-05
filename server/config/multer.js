// Using Multer to Store on Local Storage
const multer = require("multer");

// Using path module to get path
const path = require("path");

// Using uuidv4 module to generate random file name
const { v4: uuidv4 } = require("uuid");

// Setting Muter Storage for saving Images on Server
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Assets");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
  },
});

// Setting File Filter for Images
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Creating Multer Object
// const storage = multer.memoryStorage();
// const Upload = multer({ storage: storage });
const Upload = multer({ storage, fileFilter });

// Expoting to use in controllers
module.exports = Upload;
