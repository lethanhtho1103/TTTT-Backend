const express = require("express");
const router = express.Router();

const orderController = require("../app/controllers/Order");

router.post("/", orderController.sendEmail);

module.exports = router;
