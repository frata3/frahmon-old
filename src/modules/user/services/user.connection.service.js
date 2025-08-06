import autoBind from 'auto-bind';
import ConnectionModel from '../models/user.connection.model.js';
class ConnectionService {
  #Model;
  constructor() {
    autoBind(this);
    this.#Model = ConnectionModel;
  }
  async findOne(query) {
    return await this.#Model.findOne(query);
  }
  async countDocuments(query) {
    return await this.#Model.countDocuments(query);
  }
  async getFollowersCount(userId) {
    const connections = await this.#Model
      .find({ target: userId, type: "follow", status: "active" })
      .populate("source", "username fullname");
    return connections.map((c) => c.source);
  }
  async getFollowingsCount(userId) {
    const connections = await this.#Model
      .find({ source: userId, type: "follow", status: "active" })
      .populate("target", "username fullname");
    return connections.map((c) => c.target);
  }
  async countFollowers(userId) {
    return await this.#Model.countDocuments({
      target: userId,
      type: "follow",
      status: "active"
    });
  } 
  async countFollowing(userId) {
    return await this.#Model.countDocuments({
      source: userId,
      type: "follow",
      status: "active"
    });
  }
  async listFollowers(userId) {
    return await this.#Model
      .find({ target: userId, type: "follow", status: "active" })
      .populate("source", "username fullname avatar");
  }
  async listFollowing(userId) {
    return await this.#Model
      .find({ source: userId, type: "follow", status: "active" })
      .populate("target", "username fullname avatar");
  }  
  async getConnectionStatus(sourceId, targetId) {
    if (!sourceId || !targetId) return "none";
    const connection = await this.#Model.findOne({
      source: sourceId,
      target: targetId,
      type: "follow",
    });
    return connection ? connection.status : "none";
  }
  async followUser(sourceId, targetId) {
    if (sourceId === targetId) {
      return { success: false, message: "نمی‌توانید خودتان را دنبال کنید." };
    }

    const existing = await this.#Model.findOne({
      source: sourceId,
      target: targetId,
      type: "follow",
    });

    if (existing) {
      if (existing.status === "active") {
        return { success: false, message: "قبلا دنبال می‌کنید." };
      }
      if (existing.status === "pending") {
        return { success: false, message: "درخواست شما در انتظار تأیید است." };
      }
    }

    const newConnection = new this.#Model({
      source: sourceId,
      target: targetId,
      type: "follow",
      status: "active",
    });

    await newConnection.save();
    return { success: true, message: "با موفقیت دنبال شد." };
  }
  async unfollowUser(sourceId, targetId) {
    const deleted = await this.#Model.findOneAndDelete({
      source: sourceId,
      target: targetId,
      type: "follow",
      status: "active",
    });

    if (!deleted) {
      return { success: false, message: "شما این کاربر را دنبال نمی‌کردید." };
    }

    return { success: true, message: "دنبال کردن لغو شد." };
  }
  async acceptFollowRequest(targetId, sourceId) {
    const connection = await this.#Model.findOne({
      source: sourceId,
      target: targetId,
      type: "follow",
      status: "pending",
    });

    if (!connection) {
      return { success: false, message: "درخواست دنبال کردن پیدا نشد." };
    }

    connection.status = "active";
    await connection.save();

    return { success: true, message: "درخواست پذیرفته شد." };
  }
  async rejectFollowRequest(targetId, sourceId) {
    const connection = await this.#Model.findOneAndDelete({
      source: sourceId,
      target: targetId,
      type: "follow",
      status: "pending",
    });

    if (!connection) {
      return { success: false, message: "درخواستی یافت نشد." };
    }

    return { success: true, message: "درخواست رد شد." };
  }
}
export default new ConnectionService();
