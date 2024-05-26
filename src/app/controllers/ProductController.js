const multer = require("multer");
const Product = require("../models/Product");

class ProductController {
    async createProduct(req, res, next) {
    try {
      const { name,  description, price, category_id } = req.body;
      const image = req.file ? req.file.path : "";
      const Product = new Product({ name, description, price, image, category_id });
      await newProduct.save();
      return res
        .status(200)
        .json({ message: `Product created successfully: ${name}.` });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }


  async getAllProduct(req, res) {
    try {
      const product = await Product.find();
      return res.status(200).json(categories);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const image = req.file ? req.file.path : null;

      const updateData = { name, description, price, category_id };
      if (image) updateData.image = image;

      const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      return res.status(200).json({
        message: `Product updated successfully: ${updatedCategory.name}.`,
        data: updatedCategory,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;

      const deletedProduct = await Product.findByIdAndDelete(id);

      if (!deletedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      return res
        .status(200)
        .json({
          message: `Product deleted successfully: ${deletedProducte.name}.`,
        });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new ProductController();
