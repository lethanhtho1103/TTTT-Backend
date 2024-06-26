const express = require("express");
const router = express.Router();

const ConversationController = require("../app/controllers/ConversationController");

router.post("/", ConversationController.createOrAddMessage);
router.get("/", ConversationController.getAllConversations);
router.get("/:conversationId", ConversationController.getConversationDetails);
router.delete("/message", ConversationController.deleteMessage);
module.exports = router;
