const nodemailer = require("nodemailer");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const OrderDetail = require("../models/OrderDetail");
const Product = require("../models/Product");
const User = require("../models/User");

class OrderController {
  async createOrder(req, res) {
    const { userId, orderFromCart, orderDetails, singleCartItem } = req.body;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { email } = user;
      if (orderFromCart) {
        const userCart = await Cart.findOne({ user_id: userId });
        if (!userCart) {
          return res.status(404).json({ message: "Cart not found" });
        }

        if (singleCartItem) {
          const { product_id } = singleCartItem;
          const item = userCart.items.find(
            (item) => item.product_id == product_id
          );

          if (!item) {
            return res
              .status(404)
              .json({ message: "Product not found in cart" });
          }

          const quantity = item.quantity;
          const product = await Product.findById(product_id);
          if (!product) {
            return res.status(404).json({ message: "Product not found" });
          }
          if (quantity > product.quantity) {
            return res
              .status(400)
              .json({ message: "Not enough quantity for product" });
          }

          const newOrder = new Order({
            user_id: userId,
            status: "Pending",
          });
          const savedOrder = await newOrder.save();

          const productTotalPrice = product.price * quantity;
          const newOrderDetail = new OrderDetail({
            order_id: savedOrder._id,
            product_id,
            quantity,
            unit_price: product.price,
          });
          await newOrderDetail.save();

          product.quantity -= quantity;
          product.sold_quantity += quantity; // Tăng số lượng đã bán
          await product.save();

          await Cart.updateOne(
            { _id: userCart._id },
            { $pull: { items: { product_id } } }
          );

          savedOrder.total_price = productTotalPrice;
          await savedOrder.save();

          const orderController = new OrderController();
          await orderController.sendConfirmationEmail(email);

          return res
            .status(200)
            .json({ message: "Order successfully", data: savedOrder });
        } else {
          for (const item of userCart.items) {
            const { product_id, quantity } = item;
            const product = await Product.findById(product_id);
            if (!product) {
              return res.status(404).json({ message: "Product not found" });
            }
            if (quantity > product.quantity) {
              return res
                .status(400)
                .json({ message: "Not enough quantity for product" });
            }
          }

          const newOrder = new Order({
            user_id: userId,
            status: "Pending",
          });
          const savedOrder = await newOrder.save();
          let totalPrice = 0;

          for (const item of userCart.items) {
            const { product_id, quantity } = item;
            const product = await Product.findById(product_id);
            const productTotalPrice = product.price * quantity;
            totalPrice += productTotalPrice;

            const newOrderDetail = new OrderDetail({
              order_id: savedOrder._id,
              product_id,
              quantity,
              unit_price: product.price,
            });
            await newOrderDetail.save();

            product.quantity -= quantity;
            product.sold_quantity += quantity; // Tăng số lượng đã bán
            await product.save();

            await Cart.updateOne(
              { _id: userCart._id },
              { $pull: { items: { product_id } } }
            );
          }
          savedOrder.total_price = totalPrice;
          await savedOrder.save();

          const orderController = new OrderController();
          await orderController.sendConfirmationEmail(email);

          return res
            .status(200)
            .json({ message: "Order successfully", data: savedOrder });
        }
      } else {
        const { product_id, quantity, unit_price } = orderDetails;
        const product = await Product.findById(product_id);

        if (!product) {
          return res.status(404).json({ message: "Product not found" });
        }
        if (quantity > product.quantity) {
          return res
            .status(400)
            .json({ message: "Not enough quantity for product" });
        }

        const newOrder = new Order({
          user_id: userId,
          status: "Pending",
        });
        const savedOrder = await newOrder.save();
        const productTotalPrice = product.price * quantity;
        const newOrderDetail = new OrderDetail({
          order_id: savedOrder._id,
          product_id,
          quantity,
          unit_price,
        });
        await newOrderDetail.save();
        product.quantity -= quantity;
        product.sold_quantity += quantity; // Tăng số lượng đã bán
        await product.save();
        savedOrder.total_price = productTotalPrice;
        await savedOrder.save();
        const orderController = new OrderController();
        await orderController.sendConfirmationEmail(email);
        return res
          .status(200)
          .json({ message: "Order successfully", data: savedOrder });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async sendConfirmationEmail(email) {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.GOOGLE_APP_EMAIL,
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
    });

    try {
      await transporter.sendMail({
        from: '"TTTT-Shop 👻" <foo@example.com>',
        to: email,
        subject: "Xác nhận đặt hàng thành công ✔",
        text: "Cảm ơn bạn đã đặt hàng từ TTTT-Shop!",
        html: "<b>Cảm ơn bạn đã đặt hàng từ TTTT-Shop!</b>",
      });
      console.log("Email confirmation sent successfully.");
    } catch (error) {
      console.log("Error sending email confirmation:", error.message);
    }
  }

  // gửi thông báo cho admin
  async notifyAdmin(order) {
    const adminEmail = "admin@example.com";
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "your-email@gmail.com",
        pass: "your-email-password",
      },
    });

    const mailOptions = {
      from: "your-email@gmail.com",
      to: adminEmail,
      subject: "New Order Notification",
      text: `A new order has been placed.
            Status: ${order.status}
            Created At: ${order.createdAt}
            Total Price: ${order.total_price}
            User ID: ${order.user_id}
            Order ID: ${order._id}
            `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Admin notified of new order");
    } catch (error) {
      console.error("Error sending admin notification email:", error);
    }
  }

  async getAllOrdersByUserId(req, res) {
    const { userId } = req.params;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const orders = await Order.find({ user_id: userId });
      const ordersWithDetails = [];
      for (const order of orders) {
        const orderDetails = await OrderDetail.find({
          order_id: order._id,
        }).populate("product_id", "name price image"); // Populate thêm thông tin sản phẩm

        const orderWithDetails = {
          ...order._doc,
          orderDetails: orderDetails.map((detail) => ({
            _id: detail._id,
            product_id: detail.product_id._id,
            product_name: detail.product_id.name,
            product_image: detail.product_id.image,
            unit_price: detail.unit_price,
            quantity: detail.quantity,
          })),
        };
        ordersWithDetails.push(orderWithDetails);
      }

      return res.status(200).json({
        message: "Orders retrieved successfully",
        data: ordersWithDetails,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getAllOrders(req, res) {
    try {
      // Tìm tất cả các đơn hàng
      const orders = await Order.find();

      // Tạo một mảng để chứa tất cả các đơn hàng cùng với chi tiết đơn hàng của chúng
      const ordersWithDetails = [];

      for (const order of orders) {
        // Tìm tất cả các chi tiết đơn hàng tương ứng với order_id
        const orderDetails = await OrderDetail.find({
          order_id: order._id,
        }).populate("product_id", "name price image"); // Populate thêm thông tin sản phẩm

        // Kết hợp đơn hàng và chi tiết đơn hàng
        const orderWithDetails = {
          ...order._doc,
          orderDetails: orderDetails.map((detail) => ({
            _id: detail._id,
            product_id: detail.product_id._id,
            product_name: detail.product_id.name,
            product_image: detail.product_id.image,
            unit_price: detail.unit_price,
            quantity: detail.quantity,
          })),
        };

        ordersWithDetails.push(orderWithDetails);
      }

      return res.status(200).json({
        message: "All orders retrieved successfully",
        data: ordersWithDetails,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new OrderController();
