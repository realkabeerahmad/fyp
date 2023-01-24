// Using Mongoose for Mongoo DB
const mongoose = require("mongoose");
// Post Schema
const PostSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  content: String,
  Image: String,
  tags: [{ type: String, default: [] }],
  likes: [
    {
      userId: String,
      createdAt: { type: Date, default: Date.now },
      default: [],
    },
  ],
  likes_count: { type: Number, default: 0 },
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
      content: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  comments_count: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

PostSchema.index({ content: "text" });
// Expoting User Model
module.exports = mongoose.model("posts", PostSchema);
