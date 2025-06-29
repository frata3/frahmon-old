// src/modules/we/socket/index.js
const ChatSocket = require("./we.socket");

module.exports = function(io) {
  const chatSocket = new ChatSocket(io);
  chatSocket.init();
};
