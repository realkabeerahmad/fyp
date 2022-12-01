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
const Strip = require("stripe")(
  "sk_test_51M7jqtILXO2OeSWiHaLiBJ0nusNK69m7ljN5aVOLbBZ7hlhtpQPotdChUth3WNk4hSlxrYRsrqt4Xz1F4QCqeWzO00p5PefrRg"
);

// Import Product Model
const product = require("../models/product");
const cart = require("../models/cart");
const order = require("../models/order");
const { default: Stripe } = require("stripe");

// Add a Product
router.post("/addProduct", Upload.single("image"), (req, res) => {
  const obj = {
    name: req.body.name,
    category: req.body.category,
    quantity: req.body.quantity,
    price: req.body.price,
    description: req.body.description,
    Warranty: req.body.Warranty,
    Return: req.body.Return,
    StandardShipping: req.body.StandardShipping,
    FastShipping: req.body.FastShipping,
    Image: req.file.filename,
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
        throw Error(err.message);
      });
  } catch (error) {
    res.send({ status: "failed", message: error.message });
  }
});

// View a Product
router.get("/showProduct", (req, res) => {
  const { productId } = req.body;
  try {
    product.findById({ productId }, (product, err) => {
      if (product) {
        res.status(200).send({ status: "success", data: product });
      } else {
        throw Error(err.message);
      }
    });
  } catch (error) {
    res.send({ status: "failed", message: error.message });
  }
});

// View all Products
router.get("/showAllProducts", (req, res) => {
  try {
    product.find((err, data) => {
      if (data) {
        res.status(200).send({ status: "success", products: data });
      } else {
        throw Error("Products not found");
      }
    });
  } catch (error) {
    res.send({ status: "failed", message: error.message });
  }
});

// Delete a Product
router.post("/deleteProduct", (req, res) => {
  const { _id } = req.body;
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
router.post("/cart", (req, res) => {
  const { userId } = req.body;
  try {
    cart.findOne({ userId: userId }, async (err, data) => {
      if (data) {
        console.log(data);
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
router.post("/getCart", (req, res) => {
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
router.post("/getCartById", (req, res) => {
  const { _id } = req.body;
  console.log(_id);
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
router.post("/addToCart", (req, res) => {
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
router.post("/deleteFromCart", (req, res) => {
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
router.post("/updateQuantity", (req, res) => {
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
    .catch(() => {
      res.send({
        status: "failed",
        message: "Unable to Update",
      });
    });
});

router.post("/showCart", (req, res) => {
  const { cartId } = req.body;
  try {
    cart.findById({ _id: cartId }, (err, data) => {
      if (data) {
        res.status(200).send({
          status: "success",
          message: "Operation Successfull",
          cart: data,
        });
      } else {
        res.send({
          status: "failed",
          error: "Faild due to following:\n" + err.message,
        });
      }
    });
  } catch (error) {
    res.send({ status: "failed", message: error.message });
  }
});

router.post("/checkOut", async (req, res) => {
  const obj = req.body;
  try {
    for (let i = 0; i < obj.products.length; i++) {
      const _id = obj.products[i]._id;
      const quantity = obj.products[i].quantity;
      product
        .findById({ _id: _id }, (err, data) => {
          if (data) {
            var newQuan = { quantity: data.quantity - quantity };
            var NumberSold = { NumberSold: data.NumberSold + quantity };
            console.log(newQuan);
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

router.post("/showUserOrders", (req, res) => {
  const { userId } = req.body;
  order
    .find({ userId: userId })
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
router.get("/showOrders", (req, res) => {
  order
    .find({})
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

router.post("/payment", (req, res) => {
  console.log(req.body);
  Strip.customers
    .create({
      email: req.body.email,
      source: req.body.stripeToken,
      name: req.body.name,
      address: req.body.address,
    })
    .then((customer) => {
      return Strip.charges.create({
        amount: req.body.amount * 100, // Charging Rs 25
        description: "Shop Order",
        currency: "PKR",
        customer: customer.id,
      });
    })
    .then((charge) => {
      res.send("Success"); // If no error occurs
    })
    .catch((err) => {
      res.send(err); // If some error occurs
    });
});

module.exports = router;
