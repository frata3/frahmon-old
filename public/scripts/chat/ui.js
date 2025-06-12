export function renderChatPanel(html) {
    document.getElementById("chat-panel").innerHTML = html;
  }
  
  export function appendMessage(msg) {
    const el = document.createElement("div");
    el.className = "message " + (msg.sender._id === window.currentUserId ? "sent" : "received");
    el.innerText = msg.content;
    document.getElementById("messages").appendChild(el);
  }
  