const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

class CartController {
  async addToCart(req, res) {
    try {
      const { userId, productId, quantity } = req.body;

      // Validate userId and productId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid userId" });
      }
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: "Invalid productId" });
      }
      if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({ message: "Invalid quantity" });
      }

      let cart = await Cart.findOne({ user_id: userId });

      if (!cart) {
        cart = new Cart({ user_id: userId, items: [] });
      }

      const existingItemIndex = cart.items.findIndex(
        (item) => item.product_id.toString() === productId
      );

      if (existingItemIndex !== -1) {
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        cart.items.push({ product_id: productId, quantity });
      }

      await cart.save();
      return res.status(200).json({
        message: "Product added to cart successfully",
        data: cart,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getCart(req, res) {
    try {
      const { userId } = req.params;

      // Validate userId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid userId" });
      }

      const cart = await Cart.findOne({ user_id: userId }).populate(
        "items.product_id"
      );

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      return res.status(200).json({ data: cart });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateCartItem(req, res) {
    try {
      const { userId, productId, quantity } = req.body;

      // Validate userId and productId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid userId" });
      }
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: "Invalid productId" });
      }
      if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({ message: "Invalid quantity" });
      }

      const cart = await Cart.findOne({ user_id: userId });

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      const itemIndex = cart.items.findIndex(
        (item) => item.product_id.toString() === productId
      );

      if (itemIndex === -1) {
        return res.status(404).json({ message: "Product not found in cart" });
      }

      cart.items[itemIndex].quantity = quantity;

      await cart.save();
      return res.status(200).json({
        message: "Cart item updated successfully",
        data: cart,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async removeCartItem(req, res) {
    try {
      const { userId, productId } = req.body;

      // Validate userId and productId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid userId" });
      }
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: "Invalid productId" });
      }

      const cart = await Cart.findOne({ user_id: userId });

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      cart.items = cart.items.filter(
        (item) => item.product_id.toString() !== productId
      );

      await cart.save();
      return res.status(200).json({
        message: "Product removed from cart successfully",
        data: cart,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new CartController();
