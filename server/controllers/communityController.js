// Express JS used to create Routes
const express = require("express");

// Multer to upload files
const upload = require("../config/multer");
const user = require("../models/user");
const post = require("../models/post");

// Using Router from Express JS to create exportable routes
const router = express.Router();

// Add a Post
router.post("/post", (req, res) => {
  const { content, userId, name, Image } = req.body;
  const seprate = content.split(" ");
  const tags = [];
  for (let i = 0; i < seprate.length; i++) {
    if (seprate[i][0] === "#") {
      tags.push(seprate[i]);
    }
  }
  try {
    const Post = new post({
      content: content,
      user: { userId: userId, name: name, Image: Image },
      tags: tags,
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
    user.findById({ _id: userId }).then((data) => {
      post
        .findByIdAndUpdate(
          { _id: _id },
          {
            $push: {
              comments: {
                user: { _id: data._id, name: data.name, Image: data.Image },
                content: content,
              },
            },
            $inc: { comments_count: 1 },
          }
        )
        .then(() => {
          res.send({ status: "success", message: "Comment Added" });
        })
        .catch((err) => {
          res.send({ status: "failed", message: err.message });
        });
    });
  } catch (error) {
    res.send({ status: "failed", message: error.message });
  }
});
// Delete a Comment
router.post("/deleteComment", (req, res) => {
  const { content, userId, _id, commentId } = req.body;
  try {
    post
      .find({ _id: _id, comments: { _id: commentId, user: { _id: userId } } })
      .then((data) => {
        if (data) {
          post
            .findByIdAndUpdate(
              { _id: _id },
              {
                $pull: {
                  comments: {
                    _id: commentId,
                  },
                },
                $inc: { comments_count: -1 },
              }
            )
            .then(() => {
              res.send({ status: "success", message: "Comment Deleted" });
            })
            .catch((err) => {
              res.send({ status: "failed", message: err.message });
            });
        } else {
          res.send({ status: "failed", message: "Comment not Found" });
        }
      })
      .catch((err) => {
        res.send({
          status: "success",
          message: "Comment Cannot be Deleted by other Users",
        });
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

// Search Posts
router.post("/search", (req, res) => {
  const { searched_text } = req.body;
  // console.log(searched_text);
  try {
    post.ensureIndexes({ content: "text" });
    if (searched_text[0] === "#") {
      post.find({ tags: { $all: [searched_text] } }, (err, data) => {
        // console.log(data, err);
        if (data) {
          res.status(200).send({ status: "success", posts: data });
        } else {
          // throw Error("Products not found");
          res.send({
            status: "failed",
            message: "Post not found",
            posts: [],
          });
        }
      });
    } else {
      post.find({ $text: { $search: searched_text } }, (err, data) => {
        // console.log(data, err);
        if (data) {
          res.status(200).send({ status: "success", posts: data });
        } else {
          // throw Error("Products not found");
          res.send({
            status: "failed",
            message: "Post not found",
            posts: [],
          });
        }
      });
    }
  } catch (error) {
    res.send({ status: "failed", message: error.message });
  }
});

module.exports = router;
