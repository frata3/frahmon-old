document.getElementById("reply-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const content = e.target.content.value;
  const parentId = e.target.parentId.value;

  const res = await axios.post("/forum/create", {
    content,
    parentId,
  });

  const reply = res.data;

  const div = document.createElement("div");
  div.className = "reply";
  div.innerHTML = `<strong>${reply.author.fullname}</strong><p>${reply.content}</p>`;
  document.getElementById("replies-list").appendChild(div);

  e.target.reset();
});
document.querySelectorAll(".like-btn").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const postId = btn.dataset.postId;

    try {
      const res = await axios.post("/forum/like", { postId });
      const liked = res.data.liked;

      const countSpan = btn.querySelector(".like-count");
      let current = parseInt(countSpan.textContent);
      countSpan.textContent = liked ? current + 1 : current - 1;
    } catch (err) {
      alert("خطا در لایک کردن");
      console.error(err);
    }
  });
});
