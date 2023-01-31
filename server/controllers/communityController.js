// Express JS used to create Routes
const express = require("express");

// Multer to upload files
const upload = require("../config/multer");
const user = require("../models/user");
const post = require("../models/post");

// Using Router from Express JS to create exportable routes
const router = express.Router();

// Add a Post
router.post("/post", async (req, res) => {
  const { content, userId, Image } = req.body;
  // const User = await user.findById({ _id: userId });
  // console.log(User);
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
      user: userId,
      tags: tags,
      Image: Image ? Image : "",
    });
    Post.save()
      .then(() => {
        res.send({ status: "success", message: "Post Successfull" });
      })
      .catch((err) => {
        res.send({ status: "failed", message: "Error Occured" });
      });
  } catch (error) {
    res.send({ status: "failed", message: error.message });
  }
});
// Delete a Post
router.post("/post/delete", (req, res) => {
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
                user: data._id,
                content: content,
              },
            },
            $inc: { comments_count: 1 },
          }
        )
        .then(() => {
          post
            .findById({ _id: _id })
            .populate({ path: "user", select: "_id name Image" })
            .populate({ path: "comments.user", select: "_id name Image" })
            .then((post) => {
              res.send({
                status: "success",
                message: "Comment Added",
                data: post,
              });
            })
            .catch((err) => {
              res.send({ status: "failed", message: err.message });
            });
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
router.post("/comment/delete", (req, res) => {
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
  try {
    post.find(
      { _id: _id, likes: { $elemMatch: { userId: userId } } },
      (err, data) => {
        if (data.length > 0) {
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
              post
                .findById({ _id: _id })
                .populate({ path: "user", select: "_id name Image" })
                .populate({ path: "comments.user", select: "_id name Image" })
                .then((post) => {
                  res.send({
                    status: "success",
                    message: "Post Liked Successfully",
                    data: post,
                  });
                })
                .catch((err) => {
                  res.send({ status: "failed", message: "Error Occured" });
                });
            })
            .catch((err) => {
              res.send({ status: "failed", message: "Error Occured" });
            });
        }
      }
    );
  } catch (error) {
    res.send({ status: "failed", message: error.message });
  }
});
// Remove a Like
router.post("/dislike", (req, res) => {
  const { userId, _id } = req.body;
  try {
    post.find(
      { _id: _id, likes: { $elemMatch: { userId: userId } } },
      (err, data) => {
        if (data.length > 0) {
          post
            .findByIdAndUpdate(
              { _id: _id },
              {
                $pull: { likes: { userId: userId } },
                $inc: { likes_count: -1 },
              }
            )
            .then(() => {
              post
                .findById({ _id: _id })
                .populate({ path: "user", select: "_id name Image" })
                .populate({ path: "comments.user", select: "_id name Image" })
                .then((post) => {
                  res.send({
                    status: "success",
                    message: "Post DisLiked Successfully",
                    data: post,
                  });
                })
                .catch((err) => {
                  res.send({ status: "failed", message: "Error Occured" });
                });
            })
            .catch((err) => {
              res.send({ status: "failed", message: "Error Occured" });
            });
        } else {
          res.send({ status: "success", message: "Post Not Yet Liked" });
        }
      }
    );
  } catch (error) {
    res.send({ status: "failed", message: error.message });
  }
});

// Show Posts by a User
router.post("/showUserPosts", (req, res) => {
  const { userId } = req.body;
  try {
    post
      .find({ userId: userId })
      .populate({ path: "user", select: "_id name Image" })
      .populate({ path: "comments.user", select: "_id name Image" })
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
// Show All Posts in Community
router.get("/showAllPosts", (req, res) => {
  //   const { userId } = req.body;
  try {
    post
      .find({})
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "_id name Image" })
      .populate({ path: "comments.user", select: "_id name Image" })
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
  try {
    post.ensureIndexes({ content: "text" });
    if (searched_text[0] === "#") {
      post.find({ tags: { $all: [searched_text] } }, (err, data) => {
        if (data) {
          console.log(data);
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
      post
        .find({ $text: { $search: searched_text } })
        .populate({ path: "user", select: "_id name Image" })
        .populate({ path: "comments.user", select: "_id name Image" })
        .then((data) => {
          if (data) {
            res.status(200).send({ status: "success", posts: data });
          } else {
            res.send({
              status: "failed",
              message: "Post not found",
              posts: [],
            });
          }
        })
        .catch((err) => {
          res.send({
            status: "failed",
            message: "Error Occured",
            posts: [],
          });
        });
    }
  } catch (error) {
    res.send({ status: "failed", message: error.message });
  }
});

module.exports = router;
