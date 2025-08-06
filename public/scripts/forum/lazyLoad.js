document.addEventListener("DOMContentLoaded", () => {
  const main = document.querySelector("main");
  const postsContainer = document.getElementById("posts-container");
  const loading = document.getElementById("loading");
  let nextCursor = postsContainer.dataset.cursor || null;
  let isLoading = false;
  function attachActionButtons() {
    document.querySelectorAll(".action-btn .like").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.preventDefault();
        const postId = btn.closest(".action-btn").dataset.postId;
        if (!postId) return;
        try {
          const res = await axios.post(`/forum/${postId}/like`);
          if (res.data.success) {
            btn.classList.toggle("liked");
            btn.nextElementSibling.textContent = res.data.newCount;
          }
        } catch (err) {
          console.error("Like failed:", err);
        }
      });
    });
    document
      .querySelectorAll(".action-btn.reposted, .action-btn:not(.reposted)")
      .forEach((btn) => {
        const postId = btn.dataset.postId;
        const repostIcon = btn.querySelector(".repost");
        if (!postId || !repostIcon) return;
        btn.addEventListener("click", async (e) => {
          e.preventDefault();
          try {
            const res = await axios.post(`/forum/${postId}/repost`);
            if (res.data.success) {
              btn.classList.toggle("reposted");
              btn.querySelector(".counter.repost").textContent =
                res.data.newCount;
            }
          } catch (err) {
            console.error("Repost failed:", err);
          }
        });
      });
  }
  async function loadMorePosts() {
    if (!nextCursor || isLoading) return;
    isLoading = true;
    loading.style.display = "block";
    try {
      const res = await axios.get(`/forum?cursor=${nextCursor}`, {
        headers: { "X-Requested-With": "XMLHttpRequest" },
      });

      if (res.data.html) {
        postsContainer.insertAdjacentHTML("beforeend", res.data.html);
        nextCursor = res.data.nextCursor || null;
        attachActionButtons();
      } else {
        nextCursor = null;
      }
      
    } catch (err) {
      console.error("Pagination failed:", err);
    } finally {
      loading.style.display = "none";
      isLoading = false;
    }
  }
  main.addEventListener("scroll", () => {
    if (main.scrollTop + main.clientHeight >= main.scrollHeight - 300) {
      loadMorePosts();
    }
  });
  attachActionButtons();
});
