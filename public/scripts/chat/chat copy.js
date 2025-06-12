// document.addEventListener("DOMContentLoaded", () => {
//     const chatId = document.getElementById("chat-box").dataset.chatId;
  
//     const input = document.getElementById("message-input");
//     const form = document.getElementById("message-form");
//     const messageList = document.getElementById("message-list");
    
//     socket.emit("joinRoom", chatId);
  
//     form.addEventListener("submit", async (e) => {
//       e.preventDefault();
//       const content = input.value.trim();
//       if (!content) return;
  
//       try {
//         const res = await axios.post("/chat/message", {
//           chatId,
//           content,
//         });
  
//         if (res.data.success) {
//           input.value = "";
//         }
//       } catch (err) {
//         alert("خطا در ارسال پیام");
//         console.log(err);

//       }
//     });
  
//     socket.on("receiveMessage", (msg) => {
//       const item = document.createElement("div");
//       item.className = "message";
//       item.innerHTML = `
//         <div><strong>${msg.sender.username}</strong>:</div>
//         <div>${msg.content}</div>
//       `;
//       messageList.appendChild(item);
//       messageList.scrollTop = messageList.scrollHeight;
//     });
  
//   });
  