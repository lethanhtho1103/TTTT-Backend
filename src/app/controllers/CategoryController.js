const Category = require("../models/Category");

class CategoryController {
  async createCategory(req, res, next) {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: "Name is required" });
      }
      const newCategory = new Category({
        name,
      });
      await newCategory.save();
      return res
        .status(200)
        .json({ message: `Category created successfully: ${name}.` });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getAllCategories(req, res) {
    try {
      const categories = await Category.find();
      return res.status(200).json(categories);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateCategory(req, res, next) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ message: "Name is required" });
      }

      const updatedCategory = await Category.findByIdAndUpdate(
        id,
        { name },
        { new: true }
      );

      if (!updatedCategory) {
        return res.status(404).json({ message: "Category not found" });
      }

      return res.status(200).json({
        message: `Category updated successfully: ${updatedCategory.name}.`,
        data: updatedCategory,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async deleteCategory(req, res, next) {
    try {
      const { id } = req.params;

      const deletedCategory = await Category.findByIdAndDelete(id);

      if (!deletedCategory) {
        return res.status(404).json({ message: "Category not found" });
      }

      return res.status(200).json({
        message: `Category deleted successfully: ${deletedCategory.name}.`,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new CategoryController();
