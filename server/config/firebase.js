const firebaseAdmin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");
const serviceAccount = require("./pethub-ea211-firebase-adminsdk-a1nzj-5e7e3fd58f.json");

const admin = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});

const storageRef = admin.storage().bucket(`gs://pethub-ea211.appspot.com`);

const uploadFile = async (path, filename) => {
  // Upload the File
  const storage = await storageRef.upload(path, {
    public: true,
    destination: `/uploads/hashnode/${filename}`,
    metadata: {
      firebaseStorageDownloadTokens: uuidv4(),
    },
  });

  return storage[0].metadata.mediaLink;
};

module.exports = uploadFile;
// export
