const mongoose = require("mongoose");
const Order = require("../models/Order");
const OrderDetail = require("../models/OrderDetail");
const Product = require("../models/Product");
const Comment = require("../models/Comment");

class CommentController {
  async createComment(req, res) {
    const { user_id, product_id, star, content } = req.body;

    try {
      // Find all orders by the user
      const orders = await Order.find({ user_id });

      if (!orders || orders.length === 0) {
        return res
          .status(400)
          .json({ message: "User has not placed any orders." });
      }

      // Check if any of the OrderDetail documents linked to these orders contain the specified product_id
      const orderIds = orders.map((order) => order._id);
      const orderDetail = await OrderDetail.findOne({
        order_id: { $in: orderIds },
        product_id,
      });

      if (!orderDetail) {
        return res
          .status(400)
          .json({ message: "User has not ordered this product." });
      }

      // Check if a comment already exists for this product and user
      let existingComment = await Comment.findOne({
        user_id,
        product_id,
      });

      if (existingComment) {
        // Update existing comment
        existingComment.star = star;
        existingComment.content = content;
        await existingComment.save();

        // Recalculate the average star rating
        const comments = await Comment.find({ product_id });
        const averageStar =
          comments.reduce((acc, comment) => acc + comment.star, 0) /
          comments.length;

        // Update the product with the new average star rating
        await Product.findByIdAndUpdate(product_id, {
          average_star: averageStar,
        });

        return res
          .status(200)
          .json({ message: "Comment updated successfully." });
      }

      // Create a new comment
      const newComment = new Comment({
        user_id,
        product_id,
        star,
        content,
      });

      // Save the comment to the database
      await newComment.save();

      // Recalculate the average star rating and comment count
      const comments = await Comment.find({ product_id });
      const averageStar =
        comments.reduce((acc, comment) => acc + comment.star, 0) /
        comments.length;
      const commentCount = comments.length;

      // Update the product with the new average star rating and comment count
      await Product.findByIdAndUpdate(product_id, {
        average_star: averageStar,
        comment_count: commentCount,
      });

      res.status(201).json({ message: "Comment created successfully." });
    } catch (error) {
      res.status(500).json({ message: "An error occurred.", error });
    }
  }

  async getCommentsByProductId(req, res) {
    const { product_id } = req.params;
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(product_id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    try {
      const comments = await Comment.find({ product_id }).populate(
        "user_id",
        "username avatar"
      );
      res.status(200).json(comments);
    } catch (error) {
      res.status(500).json({ message: "An error occurred.", error });
    }
  }

  async deleteComment(req, res) {
    const { user_id, product_id } = req.params;
    try {
      const comment = await Comment.findOne({ user_id, product_id });
      if (!comment) {
        return res.status(404).json({ message: "Comment not found." });
      }
      // Delete the comment
      await Comment.findByIdAndDelete(comment._id);

      // Recalculate the average star rating and comment count
      const comments = await Comment.find({ product_id });
      const totalStars = comments.reduce(
        (acc, comment) => acc + comment.star,
        0
      );
      const commentCount = comments.length;

      // Calculate the average star rating (avoiding NaN)
      const averageStar = commentCount > 0 ? totalStars / commentCount : 0;

      // Update the product with the new average star rating and comment count
      await Product.findByIdAndUpdate(product_id, {
        average_star: averageStar,
        comment_count: commentCount,
      });

      res.status(200).json({ message: "Comment deleted successfully." });
    } catch (error) {
      res.status(500).json({ message: "An error occurred.", error });
    }
  }
}

module.exports = new CommentController();
