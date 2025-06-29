document.addEventListener("DOMContentLoaded", async () => {
  const e = io();
  let t = null;
  const a = window.toUsername || "",
    n = async (a) => {
      try {
        const s = await axios.get(`/we/${a}`);
        document.getElementById("chat-panel").innerHTML = s.data.html;
        const c = document.getElementById("chat-box"),
          r = c.dataset.chatId,
          o = c.dataset.chatUsername;
        (t = r), e.emit("joinRoom", r, o);
        const i = document.getElementById("message-form"),
          d = document.getElementById("messageInput");
        if (!s.data.exists) return void (t = null);
        i.onsubmit = async (s) => {
          s.preventDefault();
          const c = d.value;
          if (c.trim()) {
            if (!t)
              return (
                e.emit("createPrivateChat", a),
                void e.once("chatCreated", (a) => {
                  (t = a.chatId),
                    e.emit("joinRoom", t),
                    e.emit("sendMessage", { chatId: t, content: c });
                  const s = document.querySelector(".chat-sidebar");
                  if (
                    !document.querySelector(
                      `[data-username="${a.otherUser.username}"]`
                    )
                  ) {
                    const e = document.createElement("div");
                    (e.className = "chat-user"),
                      (e.dataset.username = a.otherUser.username),
                      (e.innerHTML = `\n                <div>\n                  <p>${
                        a.otherUser.fullname || a.otherUser.username
                      }</p>\n                  <small>\n                    ${
                        a.lastMessage
                          ? a.lastMessage.content.slice(0, 30)
                          : "پیامی نیست"
                      }<br />\n                    ${new Date(
                        a.lastMessage.createdAt
                      ).toLocaleTimeString("fa-IR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}\n                  </small>\n                </div>\n              `),
                      s.appendChild(e),
                      e.addEventListener("click", async () => {
                        document
                          .querySelectorAll(".chat-user")
                          .forEach((e) => e.classList.remove("active")),
                          e.classList.add("active"),
                          await n(a.otherUser.username);
                      });
                  }
                })
              );
            e.emit("sendMessage", { chatId: t, content: c }), (d.value = "");
          }
        };
      } catch (e) {}
    };
  if (a.length > 2) await n(a);
  else if (a.length > 1) {
    document.getElementById("chat-panel").innerHTML = "یک گفتگو را انتخاب کنید";
  } else {
    document.getElementById("chat-panel").innerHTML =
      "کاربری با این نام کاربری یافت نشد.";
  }
  e.on("newMessage", (e) => {
    if (e.chatId !== t) return;
    const a = document.getElementById("messages");
    if (a) {
      const t = document.createElement("div"),
        n = String(e.sender._id) === String(window.currentUserId);
      (t.className = "message " + (n ? "sent" : "received")),
        (t.innerText = e.content),
        a.appendChild(t),
        (a.scrollTop = a.scrollHeight);
    }
  }),
    e.on("chatCreated", (e) => {
      const t = document.querySelector(".chat-sidebar");
      if (document.querySelector(`[data-username="${e.otherUser.username}"]`))
        return;
      const a = document.createElement("div");
      (a.className = "chat-user"),
        (a.dataset.username = e.otherUser.username),
        (a.innerHTML = `\n      <div>\n        <p>${
          e.otherUser.fullname || e.otherUser.username
        }</p>\n        <small>\n          ${
          e.lastMessage ? e.lastMessage.content.slice(0, 30) : "پیامی نیست"
        }<br />\n          ${new Date(
          e.lastMessage.createdAt
        ).toLocaleTimeString("fa-IR", {
          hour: "2-digit",
          minute: "2-digit",
        })}\n        </small>\n      </div>\n    `),
        t.appendChild(a),
        a.addEventListener("click", async (t) => {
          document
            .querySelectorAll(".chat-user")
            .forEach((e) => e.classList.remove("active")),
            a.classList.add("active"),
            await n(e.otherUser.username);
        });
    }),
    document.querySelectorAll(".chat-user").forEach((e) => {
      e.addEventListener("click", async (e) => {
        const t = e.target.closest(".chat-user");
        if (!t) return;
        const a = t.dataset.username;
        if (!a) return;
        const s = await axios.get(`/we/${a}`);
        (document.getElementById("chat-panel").innerHTML = s.data.html),
          s.data.exists &&
            (document
              .querySelectorAll(".chat-user")
              .forEach((e) => e.classList.remove("active")),
            t.classList.add("active")),
          await n(a);
      });
    });
});
