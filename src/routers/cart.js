const express = require("express");
const router = express.Router();

const cartController = require("../app/controllers/CartController");

router.post("/", cartController.addToCart);
router.get("/:userId", cartController.getCart);
router.put("/:id", cartController.updateCartItem);
router.delete("/:id", cartController.removeCartItem);

module.exports = router;
