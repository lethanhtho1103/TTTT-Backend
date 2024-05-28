const express = require("express");
const router = express.Router();

const accessoryController = require("../app/controllers/AccessoryController");

router.post("/", accessoryController.createAccessory);
router.get("/", accessoryController.getAllAccessory);
router.put("/:id", accessoryController.updateAccessory);
router.delete("/:id", accessoryController.deleteAccessory);

module.exports = router;
