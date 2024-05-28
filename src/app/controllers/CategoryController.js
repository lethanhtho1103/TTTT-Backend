const Category = require("../models/Category");
const Accessory = require("../models/Accessory");

class CategoryController {
  async createCategory(req, res, next) {
    try {
      const { name, accessory_id } = req.body;

      if (!name) {
        return res.status(400).json({ message: "Name is required" });
      }

      if (accessory_id) {
        const accessoryExists = await Accessory.findById(accessory_id);
        if (!accessoryExists) {
          return res.status(400).json({ message: "Invalid accessory_id" });
        }
      }

      const newCategory = new Category({
        name,
        accessory_id,
      });

      await newCategory.save();
      return res.status(200).json({
        message: `Category created successfully: ${name}.`,
        data: newCategory,
      });
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
      const categoryId = req.params.id;
      const name = req.body.name;
      const accessory_id = req.body.accessory_id;

      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      if (accessory_id) {
        const accessoryExists = await Accessory.findById(accessory_id);
        if (!accessoryExists) {
          return res.status(400).json({ message: "Invalid accessory_id" });
        }
      }
      if (name) category.name = name;
      if (accessory_id) category.accessory_id = accessory_id;

      await category.save();
      return res.status(200).json({
        message: `category updated successfully: ${category.name}.`,
        data: category,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
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
