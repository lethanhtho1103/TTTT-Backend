const auth = require("./auth");
const accessory = require("./accessory");
const category = require("./category");
const product = require("./product");
const cart = require("./cart");
const order = require("./order");
const google = require("./google");
const facebook = require("./facebook");
const comment = require("./comment");

function route(app) {
  app.use("/api/authentication", auth);
  app.use("/api/accessory", accessory);
  app.use("/api/category", category);
  app.use("/api/product", product);
  app.use("/api/order", order);
  app.use("/api/cart", cart);
  app.use("/", facebook);
  app.use("/", google);
  app.use("/api/comment", comment);
}

module.exports = route;
