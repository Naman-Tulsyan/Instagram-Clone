import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { getSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const sender = req.user;
    if (!sender) {
      return res.status(400).json({
        success: false,
        message: "Bad Authentication",
      });
    }

    const receiverId = req.params.id;
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(400).json({
        success: false,
        message: "Invalid receiver",
      });
    }

    const { message } = req.body;
    if (!message) {
      return res.status(400).json({
        success: false,
        message: "message is required",
      });
    }

    const createdMessage = await Message.create({
      senderId: sender._id,
      receiverId: receiver._id,
      message,
    });

    let conversation = await Conversation.findOne({
      participants: { $all: [sender._id, receiver._id] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [sender._id, receiver._id],
      });
    }

    if (createdMessage && Array.isArray(conversation.message)) {
      conversation.message.push(createdMessage._id);
    }

    await Promise.all([conversation.save(), createdMessage.save()]);

    // Logic for Web Socket

    const receiverSocketId = getSocketId(receiver._id);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMsg', createdMessage)
    }

    return res.status(200).json({
      success: true,
      message: "message sent successfully",
      text: createdMessage,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMessage = async (req, res) => {
    try {
    const sender = req.user;
    if (!sender) {
      return res.status(400).json({
        success: false,
        message: "Bad Authentication",
      });
    }

    const receiverId = req.params.id;

    const conversation = await Conversation.findOne({
      participants: { $all: [sender._id, receiverId] },
    }).populate("message"); // populate messages

    if (!conversation) {
      return res.status(200).json({
        success: true,
        messages: [],
      });
    }

    return res.status(200).json({
      success: true,
      messages: conversation.message || [],
    });
  } catch (error) {
    console.error("Get Message Error:", error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};