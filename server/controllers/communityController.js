// Express JS used to create Routes
const express = require("express");

// Multer to upload files
const upload = require("../config/multer");

// UUID V4 for generation Link
const { v4: uuidv4 } = require("uuid");

// Pet Model Created using MongoDB
const User = require("../models/user");

// Pet Model Created using MongoDB
const Pet = require("../models/pet");

// Shelter Details Model
const shelter = require("../models/shelter");

// Adoption Form Model
const adoptionForm = require("../models/adoptionForm");
const user = require("../models/user");
const post = require("../models/post");

// Using Router from Express JS to create exportable routes
const router = express.Router();

// Add a Post
router.post("/post", (req, res) => {
  const { content, userId, name, Image, tags } = req.body;
  const newTags = tags.split(",");
  try {
    const Post = new post({
      content: content,
      user: { userId: userId, name: name, Image: Image },
      tags: newTags,
    });
    Post.save()
      .then(() => {
        res.send({ status: "success", message: "Post Successfull" });
      })
      .catch((err) => {
        console.log(err);
        res.send({ status: "failed", message: "Error Occured" });
      });
  } catch (error) {
    res.send({ status: "failed", message: error.message });
  }
});
// Delete a Post
router.post("/deletePost", (req, res) => {
  const { _id } = req.body;
  try {
    post
      .findByIdAndDelete({ _id: _id })
      .then(() => {
        res.send({ status: "success", message: "Post Deleted Successfull" });
      })
      .catch((err) => {
        res.send({ status: "failed", message: "Error Occured" });
      });
  } catch (error) {
    res.send({ status: "failed", message: error.message });
  }
});
// Add a Comment
router.post("/comment", (req, res) => {
  const { content, userId, _id } = req.body;
  try {
    post
      .findByIdAndUpdate(
        { _id: _id },
        {
          $push: { comments: { userId: userId, content: content } },
          $inc: { comments_count: 1 },
        }
      )
      .then(() => {
        res.send({ status: "success", message: "Comment Added" });
      })
      .catch((err) => {
        res.send({ status: "failed", message: err.message });
      });
  } catch (error) {
    res.send({ status: "failed", message: error.message });
  }
});

// Add a Like
router.post("/like", (req, res) => {
  const { userId, _id } = req.body;
  var flag;
  try {
    post.findById({ _id: _id }, (err, data) => {
      if (err) {
        res.send({ status: "failed", message: "Error Occured" });
      } else if (data) {
        if (data.likes.length > 0) {
          for (let i = 0; i < data.likes.length; i++) {
            if (data.likes[i].userId === userId) {
              flag = true;
              break;
            }
          }
        }
        if (flag) {
          res.send({ status: "success", message: "Post already Liked" });
        } else {
          post
            .findByIdAndUpdate(
              { _id: _id },
              {
                $push: { likes: { userId: userId } },
                $inc: { likes_count: 1 },
              }
            )
            .then(() => {
              res.send({
                status: "success",
                message: "Post Liked Successfully",
              });
            })
            .catch((err) => {
              res.send({ status: "failed", message: "Error Occured" });
            });
        }
      }
    });
  } catch (error) {
    res.send({ status: "failed", message: error.message });
  }
});
// Show Posts by a User
router.post("/showUserPosts", (req, res) => {
  const { userId } = req.body;
  try {
    post.find({ userId: userId }).then((posts) => {
      res.send({ status: "success", message: "User Posts Sent", data: posts });
    });
  } catch (error) {
    res.send({ status: "failed", message: error.message });
  }
});
// Show All Posts in Community
router.get("/showAllPosts", (req, res) => {
  //   const { userId } = req.body;
  try {
    post
      .find({})
      .sort({ createdAt: -1 })
      .then((posts) => {
        res.send({
          status: "success",
          message: "User Posts Sent",
          data: posts,
        });
      });
  } catch (error) {
    res.send({ status: "failed", message: error.message });
  }
});

module.exports = router;
