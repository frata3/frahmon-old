// src/modules/we/socket/index.js
import ChatSocket from './we.socket.js';

export default function(io) {
  const chatSocket = new ChatSocket(io);
  chatSocket.init();
};
