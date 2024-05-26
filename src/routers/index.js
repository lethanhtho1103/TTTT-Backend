const auth = require("./auth");
const category = require("./category");
const product = require("./product");
const google = require("./google");
const facebook = require("./facebook");

function route(app) {
  app.use("/api/authentication", auth);
  app.use("/api/category", category);
  app.use("/api/product", product);
  app.use("/", facebook);
  app.use("/", google);
}

module.exports = route;
