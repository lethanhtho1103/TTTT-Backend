const express = require("express");
const router = express.Router();

const orderController = require("../app/controllers/OrderController");

// router.post("/", orderController.sendEmail);
router.post("/", orderController.createOrder);

module.exports = router;
