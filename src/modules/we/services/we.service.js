const autoBind = require("auto-bind");
const ChatModel = require("../models/we.model");
const ChatMessageModel = require("../models/we.message.model");
const UserService = require("../../user/services/user.service");
class ChatService {
  #chatModel;
  #messageModel;
  #userService;
  constructor() {
    autoBind(this);
    this.#chatModel = ChatModel;
    this.#messageModel = ChatMessageModel;
    this.#userService = UserService;
  }
  async findUserByUsername(username) {
    return await this.#userService.findOne({ username: username });
   }
  async getUserChats(userId) {
    return await this.#chatModel
      .find({ members: userId })
      .populate("members", "username avatar fullname")
      .populate({
        path: "lastMessage",
        populate: { path: "sender", select: "username fullname" },
      });
  }
  async getPrivateChat(userA, userB) {
    return await this.#chatModel.findOne({
      type: "private",
      members: { $all: [userA, userB] },
      $expr: { $eq: [{ $size: "$members" }, 2] },
    });
  }
  async createPrivateChat(userA, userB) {
    return await this.#chatModel.create({
      type: "private",
      members: [userA, userB],
    });
  }
  async getChatMessages(chatId, limit = 50, skip = 0) {
    return await this.#messageModel
      .find({ chat: chatId })
      .populate("sender", "username avatar")
      .populate("replyTo")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }
  async getLastMessage(chatId) {
    return await this.#messageModel.findOne({ chat: chatId })
      .sort({ createdAt: -1 })
      .populate("sender", "username fullname");
  }
  
  async createMessage({ chatId, senderId, content, replyTo = null }) {
    const chat = await this.#chatModel.findById(chatId);
    if (!chat) throw new Error("Chat not found");

    const newMessage = await this.#messageModel.create({
      chat: chatId,
      sender: senderId,
      content,
      replyTo,
    });

    chat.lastMessage = newMessage._id;
    await chat.save();

    return await this.#messageModel
      .findById(newMessage._id)
      .populate("sender", "username avatar")
      .populate({
        path: "chat",
        select: "_id members",
      })
      
  }
}
module.exports = new ChatService();
