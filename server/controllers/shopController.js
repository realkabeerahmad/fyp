// to Read Enviorment Variables
const dotenv = require("dotenv");

// Express JS used to create Routes
const express = require("express");

// Using Router from Express JS to create exportable routes
const router = express.Router();

// Setting Up Envionment Variables
dotenv.config();

// Import Multer Storage
const Upload = require("../config/multer");

// UUID V4 for generation Link
const { v4: uuidv4 } = require("uuid");

// Strip for Payment
("sk_test_51M7jqtILXO2OeSWiHaLiBJ0nusNK69m7ljN5aVOLbBZ7hlhtpQPotdChUth3WNk4hSlxrYRsrqt4Xz1F4QCqeWzO00p5PefrRg");

// Import Product Model
const product = require("../models/product");
const cart = require("../models/cart");
const order = require("../models/order");
const { default: Stripe } = require("stripe")(
  "sk_test_51M7jqtILXO2OeSWiHaLiBJ0nusNK69m7ljN5aVOLbBZ7hlhtpQPotdChUth3WNk4hSlxrYRsrqt4Xz1F4QCqeWzO00p5PefrRg"
);
const uploadFile = require("../config/firebase");
const fs = require("fs");
const user = require("../models/user");

// Add a Product
router.post("/add", async (req, res) => {
  var obj = {
    name: req.body.name,
    category: req.body.category,
    quantity: req.body.quantity,
    price: req.body.price,
    description: req.body.description,
    Warranty: req.body.Warranty,
    Return: req.body.Return,
    StandardShipping: req.body.StandardShipping,
    FastShipping: req.body.FastShipping,
    Image: req.body.Image,
  };
  try {
    const Product = new product(obj);
    Product.save()
      .then(() => {
        res
          .status(200)
          .send({ status: "success", message: "Product Saved Successfully" });
      })
      .catch((err) => {
        res
          .status(200)
          .send({ status: "failed", message: "Product Not Saved." });
      });
  } catch (error) {
    res.send({ status: "failed", message: error.message });
  }
});
// Add a Product
router.post("/edit", async (req, res) => {
  const { _id, quantity } = req.body;
  try {
    product
      .findByIdAndUpdate({ _id: _id }, { $inc: { quantity: quantity } })
      .then(() => {
        res.send({ status: "success", message: "Quantity Updated" });
      })
      .catch((err) => {
        res.send({ status: "failed", message: err.message });
      });
  } catch (error) {
    res.send({ status: "failed", message: error.message });
  }
});

// View a Product
router.get("/show:_id", (req, res) => {
  const { _id } = req.params;
  console.log(_id);
  try {
    product
      .findById({ _id: _id })
      .then((data) => {
        res.status(200).send({ status: "success", data: data });
      })
      .catch((err) => {
        res.send({ status: "failed", message: err.message });
      });
  } catch (error) {
    res.send({ status: "failed", message: error.message });
  }
});

// View all Products
router.get("/show/all", (req, res) => {
  try {
    product.find((err, data) => {
      if (data) {
        res.status(200).send({ status: "success", products: data });
      } else {
        res.status(200).send({ status: "failed", products: [] });
        // throw Error("Products not found");
      }
    });
  } catch (error) {
    res.send({ status: "failed", message: error.message });
  }
});

// View all Products
router.post("/search", (req, res) => {
  const { searched_text } = req.body;
  try {
    product.ensureIndexes({ name: "text", category: "text" });

    product.find({ $text: { $search: searched_text } }, (err, data) => {
      if (data) {
        res.status(200).send({ status: "success", products: data });
      } else {
        // throw Error("Products not found");
        res.send({
          status: "failed",
          message: "Products not found",
          products: [],
        });
      }
    });
  } catch (error) {
    res.send({ status: "failed", message: error.message });
  }
});

// Filter
router.post("/filter", (req, res) => {
  const { category, from, to } = req.body;
  try {
    // product.ensureIndexes({ name: "text", category: "text" });
    if (category) {
      product
        .find({ category: category, price: { $gt: from, $lt: to } })
        .then((data) => {
          res.status(200).send({ status: "success", products: data });
        })
        .catch((err) => {
          res.send({
            status: "failed",
            message: "Products not found",
            products: [],
          });
        });
    } else if (!category) {
      product
        .find({ price: { $gt: from, $lt: to } })
        .then((data) => {
          res.status(200).send({ status: "success", products: data });
        })
        .catch((err) => {
          res.send({
            status: "failed",
            message: "Products not found",
            products: [],
          });
        });
    }
  } catch (error) {
    res.send({ status: "failed", message: error.message });
  }
});

// Rate a Product
router.post("/rate", (req, res) => {
  const { _id, userId, value } = req.body;
  try {
    product
      .find({ _id: _id, rating: { $elemMatch: { userId: userId } } })
      .then((p) => {
        if (p.length <= 0) {
          product
            .findByIdAndUpdate(
              { _id: _id },
              {
                $push: {
                  rating: { userId: userId, value: value },
                },
              }
            )
            .then(async () => {
              const data = await product.findById({ _id: _id });
              res.send({
                status: "success",
                message: "Rating Added",
                data: data,
              });
            })
            .catch((err) => {
              res.send({ status: "failed", message: "Error Occured" + err });
            });
        } else {
          product
            .findOneAndUpdate(
              { _id: _id, rating: { $elemMatch: { userId: userId } } },
              {
                $set: {
                  "rating.$.value": value,
                },
              }
            )
            .then(async () => {
              const data = await product.findById({ _id: _id });
              res.send({
                status: "success",
                message: "Rating Updated",
                data: data,
              });
            })
            .catch((err) => {
              res.send({ status: "failed", message: "Error Occured" + err });
            });
        }
      });
  } catch (error) {
    res.send({ status: "failed", message: error.message });
  }
});

// Delete a Product
router.delete("/delete:_id", (req, res) => {
  const { _id } = req.params;
  try {
    product
      .findByIdAndDelete({ _id: _id })
      .then(() => {
        res.status(200).send({
          status: "success",
          message: "Product Deleted Successfully",
        });
      })
      .catch((err) => {
        throw Error(err.message);
      });
  } catch (error) {
    res.send({ status: "failed", message: error.message });
  }
});

// Create Cart
router.post("/cart/new", (req, res) => {
  const { userId } = req.body;
  console.log(req.body);
  try {
    cart.findOne({ userId: userId }, async (err, data) => {
      if (data) {
        res.send({
          status: "failed",
          message: "Cart Already Exist",
          cart: data,
        });
      } else {
        const Cart = new cart({ userId });
        await Cart.save();
        res.send({ status: "success", message: "Cart Created" });
      }
    });
  } catch (error) {
    res.send({ status: "failed", message: error.message });
  }
});

// Show Cart
router.post("/cart/show", (req, res) => {
  const { userId } = req.body;
  try {
    cart.find({ userId: userId }, async (err, data) => {
      if (data) {
        res.send({
          status: "success",
          message: "Cart Sent Successfully",
          cart: data,
        });
      } else {
        res.send({ status: "failed", message: "Cart Not Found" });
      }
    });
  } catch (error) {
    res.send({ status: "failed", message: error.message });
  }
});

// Show Cart by ID
router.post("/cart/show/id", (req, res) => {
  const { _id } = req.body;
  try {
    cart.findById({ _id: _id }, async (err, data) => {
      if (data) {
        res.send({
          status: "success",
          message: "Cart Sent Successfully",
          cart: data,
        });
      } else {
        res.send({ status: "failed", message: "Cart Not Found" });
      }
    });
  } catch (error) {
    res.send({ status: "failed", message: error.message });
  }
});

// Add Product to Cart
router.post("/cart/add", (req, res) => {
  const { _id, name, price, image, cartId, quantity } = req.body;
  try {
    product.findById({ _id: _id }, (err, data) => {
      if (data) {
        if (quantity > data.quantity) {
          res.send({ status: "failed", message: "Product went Out of stock." });
        }
      }
    });
    cart.findOne(
      { _id: cartId, products: { $elemMatch: { _id: _id } } },
      (err, data) => {
        if (data) {
          cart
            .updateOne(
              { _id: cartId, products: { $elemMatch: { _id: _id } } },
              { $set: { "products.$.quantity": quantity } }
            )
            .then(() => {
              res.send({
                status: "success",
                message: "Product quantity updated in Cart",
              });
            })
            .catch(() => {
              res.send({
                status: "failed",
                error: "Unable to Update",
              });
            });
        } else {
          cart
            .updateOne(
              { _id: cartId },
              {
                $push: {
                  products: {
                    _id: _id,
                    name: name,
                    Image: image,
                    price: price,
                    quantity: quantity,
                  },
                },
              }
            )
            .then(() => {
              res.send({
                status: "success",
                message: "Product Added to Cart Successfully",
              });
            })
            .catch((err) => {
              res.send({
                status: "failed",
                error: "Faild to add due to following:\n" + err.message,
              });
            });
        }
      }
    );
  } catch (error) {
    res.send({ status: "success", message: error.message });
  }
});

// Delete From Cart
router.post("/cart/delete", (req, res) => {
  const { cartId, _id } = req.body;
  try {
    cart
      .findByIdAndUpdate({ _id: cartId }, { $pull: { products: { _id: _id } } })
      .then(() => {
        res.send({
          status: "success",
          message: "Deleted Successfully",
        });
      })
      .catch((err) => {
        res.send({
          status: "failed",
          message: "Unable to Delete" + err.message,
        });
      });
  } catch (error) {
    res.send({ status: "failed", message: error.message });
  }
});

// Update Cart Quantity
router.post("/cart/update/quantity", (req, res) => {
  const { cartId, _id, quantity } = req.body;
  cart
    .updateOne(
      {
        _id: cartId,
        products: { $elemMatch: { _id: _id } },
      },
      {
        $set: {
          "products.$.quantity": quantity,
        },
      }
    )
    .then(() => {
      res.send({
        status: "success",
        message: "Product quantity updated in Cart",
      });
    })
    .catch((err) => {
      console.log(err);
      res.send({
        status: "failed",
        message: "Unable to Update",
      });
    });
});

// Check Out
router.post("/checkOut", async (req, res) => {
  const obj = req.body;
  console.log(obj);
  try {
    for (let i = 0; i < obj.products.length; i++) {
      const _id = obj.products[i]._id;
      const quantity = obj.products[i].quantity;
      product
        .findById({ _id: _id }, (err, data) => {
          if (data) {
            var newQuan = { quantity: data.quantity - quantity };
            var NumberSold = { NumberSold: data.NumberSold + quantity };
            product
              .findByIdAndUpdate(
                { _id: _id },
                {
                  quantity: newQuan.quantity,
                  NumberSold: NumberSold.NumberSold,
                }
              )
              .then(() => {
                console.log("done");
              })
              .catch((err) => {
                console.log(err, "Not Done");
              });
          }
        })
        .clone();
    }
    const Order = new order(obj);
    await Order.save()
      .then(() => {
        cart
          .findByIdAndUpdate({ _id: obj.cartId }, { products: [] })
          .then(() => {
            res.send({
              status: "success",
              message: "Order placed successfully",
            });
          })
          .catch((err) => {
            res.send({ status: failed, message: "Order not placed" });
          });
      })
      .catch((err) => {
        res.send({ status: failed, message: "Order not placed" });
      });
  } catch (error) {}
});

// Show User Orders
router.post("/order/show/user", (req, res) => {
  const { userId } = req.body;
  order
    .find({ userId: userId })
    .sort({ createdAt: -1 })
    .then((data) => {
      res.send({
        status: "success",
        message: "Orders data fetched",
        orders: data,
      });
    })
    .catch((err) => {
      res.send({
        status: "failed",
        message: "No Orders data fetched",
        // orders: data,
      });
    });
});

// Show Orders
router.get("/order/show", (req, res) => {
  order
    .find({})
    .sort({ createdAt: -1 })
    .then((data) => {
      res.send({
        status: "success",
        message: "Orders data fetched",
        orders: data,
      });
    })
    .catch((err) => {
      res.send({
        status: "failed",
        message: "No Orders data fetched",
        // orders: data,
      });
    });
});

router.post("/order/update", (req, res) => {
  const { _id, TrackingService, TrackingId, status } = req.body;
  order
    .findByIdAndUpdate(
      { _id: _id },
      {
        status: status,
        TrackingService: TrackingService,
        TrackingId: TrackingId,
      }
    )
    .then(async () => {
      const o = await order.findById({ _id: _id });
      res.send({ status: "success", message: "Order Updated", data: o });
    })
    .catch((err) => {
      res.send({
        status: "failed",
        message: "Order can't be Updated" + err.message,
      });
    });
});

// Payment
router.post("/payment", (req, res, next) => {
  console.log(req.body.token);
  const { token, amount } = req.body;
  const idempotencyKey = uuidv4();
  return Stripe.Customers.create({
    email: token.email,
    source: token,
  })
    .then((customer) => {
      Stripe.Charges.create(
        {
          amount: amount * 100,
          currency: "usd",
          customer: customer.id,
          receipt_email: token.email,
        },
        { idempotencyKey }
      );
    })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/wish", async (req, res) => {
  const { userId, _id } = req.body;
  const p = await product.findById({ _id: _id });
  user
    .find({ _id: userId, product_wish: { $elemMatch: { _id: _id } } })
    .then((data) => {
      if (data.length > 0) {
        // res.send({ status: "failed", message: "Already in WishList" });
        user
          .findByIdAndUpdate(
            { _id: userId },
            // { new: true },
            {
              $pull: {
                product_wish: { _id: p._id },
              },
            }
          )
          .then(async () => {
            const User = await user.findById({ _id: userId });
            res.send({
              status: "success",
              message: "Removed from WishList",
              data: User,
            });
          })
          .catch((err) => {
            res.send({ status: "failed", message: err.message });
          });
      } else {
        user
          .findByIdAndUpdate(
            { _id: userId },
            // { new: true },
            {
              $push: {
                product_wish: { _id: p._id, name: p.name, image: p.Image },
              },
            }
          )
          .then(async () => {
            const User = await user.findById({ _id: userId });
            res.send({
              status: "success",
              message: "Added to WishList",
              data: User,
            });
          })
          .catch((err) => {
            res.send({ status: "failed", message: err.message });
          });
      }
    })
    .catch((err) => {
      res.send({ status: "failed", message: err.message });
    });
  // user.findByIdAndUpdate();
});
module.exports = router;
