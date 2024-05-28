const express = require("express");
const router = express.Router();

const cartController = require("../app/controllers/CartController");

router.post('/', CartController.addToCart);
router.get('/userId', CartController.getCart);
router.put('/', CartController.updateCartItem);
router.delete('/', CartController.removeCartItem);

module.exports = router;

