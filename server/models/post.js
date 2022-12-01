// Using Mongoose for Mongoo DB
const mongoose = require("mongoose");
// Post Schema
const PostSchema = mongoose.Schema({
  user: {
    _id: String,
    name: String,
    Image: String,
  },
  content: String,
  //   likes: [
  //     {
  //       userId: String,
  //       createdAt: { type: Date, default: Date.now },
  //       default: [],
  //     },
  //   ],
  comments: [
    {
      userId: String,
      content: String,
      createdAt: { type: Date, default: Date.now },
      default: [],
    },
  ],
  createdAt: { type: Date, default: Date.now },
});
// Expoting User Model
module.exports = mongoose.model("posts", PostSchema);
