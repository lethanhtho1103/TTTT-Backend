const Accessory = require("../models/Accessory");
const Category = require("../models/Category");

class AccessoryController {
  async createAccessory(req, res, next) {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: "Name is required" });
      }
      const newAccessory = new Accessory({
        name,
      });
      await newAccessory.save();
      return res.status(200).json({
        message: `Accessory created successfully: ${name}.`,
        data: newAccessory,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getAllAccessory(req, res) {
    try {
      const accessories = await Accessory.find();
      const accessoriesWithCategories = await Promise.all(
        accessories.map(async (accessory) => {
          const categories = await Category.find({
            accessory_id: accessory._id,
          });
          return {
            ...accessory._doc,
            categories,
          };
        })
      );

      // Return the result
      return res.status(200).json(accessoriesWithCategories);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getAccessoryById(req, res) {
    try {
      const accessoryId = req.params.id;
      const accessory = await Accessory.findById(accessoryId);
      if (!accessory) {
        return res.status(404).json({ message: "Accessory not found" });
      }
      const categories = await Category.find({ accessory_id: accessory._id });
      const accessoryWithCategories = {
        ...accessory._doc,
        categories,
      };
      return res.status(200).json(accessoryWithCategories);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateAccessory(req, res, next) {
    try {
      const accessoryId = req.params.id;
      const name = req.body.name;

      const accessory = await Accessory.findById(accessoryId);
      if (!Accessory) {
        return res.status(404).json({ message: "Accessory not found" });
      }
      if (name) accessory.name = name;

      await accessory.save();
      return res.status(200).json({
        message: `Accessory updated successfully: ${accessory.name}.`,
        data: accessory,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteAccessory(req, res, next) {
    try {
      const { id } = req.params;
      const deletedAccessory = await Accessory.findByIdAndDelete(id);

      if (!deletedAccessory) {
        return res.status(404).json({ message: "Accessory not found" });
      }

      return res.status(200).json({
        message: `Accessory deleted successfully: ${deletedAccessory.name}.`,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new AccessoryController();
