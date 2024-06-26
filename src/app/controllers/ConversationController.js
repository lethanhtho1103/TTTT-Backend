const User = require("../models/User");
const Conversation = require("../models/Conversation");

class ConversationController {
  constructor() {
    this.getAdminId = this.getAdminId.bind(this);
  }

  async getAdminId(req, res) {
    try {
      const admin = await User.findOne({ admin: true });
      if (!admin) {
        throw new Error("No admin found");
      }
      return admin._id;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createOrAddMessage(req, res) {
    const { conversationId, senderId, messageContent } = req.body;
    try {
      const sender = await User.findById(senderId);
      if (!sender) {
        throw new Error("Sender not found");
      }

      let conversation;
      if (conversationId) {
        conversation = await Conversation.findById(conversationId);
        if (!conversation) {
          throw new Error("Conversation not found");
        }
      } else {
        let receiverId;
        if (sender.admin) {
          const receiver = await User.findOne({
            _id: { $ne: senderId },
            admin: false,
          });
          if (!receiver) {
            throw new Error("No user found to start a conversation");
          }
          receiverId = receiver._id;
        } else {
          receiverId = await this.getAdminId();
        }

        conversation = new Conversation({
          participants: [senderId, receiverId],
          messages: [],
        });
      }

      // Add the new message
      conversation.messages.push({
        sender: senderId,
        content: messageContent,
      });

      await conversation.save();
      return res.status(200).json(conversation);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }

  async getConversationDetails(req, res) {
    const { conversationId } = req.params;
    try {
      const conversation = await Conversation.findById(conversationId)
        .populate("participants", "username admin")
        .populate("messages.sender", "username admin");

      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }

      return res.status(200).json(conversation);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }

  async getAllConversations(req, res) {
    try {
      const conversations = await Conversation.find()
        .populate("participants", "username admin")
        .populate("messages.sender", "username admin");

      return res.status(200).json(conversations);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }

  async deleteMessage(req, res) {
    const { conversationId, messageId } = req.body;
    try {
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      const messageIndex = conversation.messages.findIndex(
        (message) => message._id.toString() === messageId
      );
      if (messageIndex === -1) {
        return res.status(404).json({ error: "Message not found" });
      }
      conversation.messages.splice(messageIndex, 1);
      await conversation.save();
      return res.status(200).json(conversation);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ConversationController();
