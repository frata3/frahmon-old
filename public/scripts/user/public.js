import { showToastTop } from "../utils/showToast.js";

document.addEventListener("DOMContentLoaded", () => {
  const followBtn = document.getElementById("follow-btn");
  const username = document.getElementById("user-data-username").innerText;
  const userId = document.getElementById("user-data-id").value;

  if (followBtn) {
    followBtn.addEventListener("click", async () => {
      const isFollowing = followBtn.getAttribute("data-following") === "true";

      const mutation = `
        mutation FollowOrUnfollow($targetId: ID!) {
          ${isFollowing ? "unfollowUser" : "followUser"}(targetId: $targetId) {
            success
            message
          }
        }
      `;

      try {
        const res = await axios.post("/graphql", {
          query: mutation,
          variables: { targetId: userId },
        });

        const result =
          res.data.data[isFollowing ? "unfollowUser" : "followUser"];

        if (result.success) {
          const countSpan = document.querySelector(
            ".profile-follow-stats strong"
          );
          let count = parseInt(countSpan.innerText, 10) || 0;
          count += isFollowing ? -1 : 1;
          countSpan.innerText = count;

          followBtn.innerText = isFollowing ? "دنبال کردن" : "آنفالو";
          followBtn.classList.toggle("btn-follow", isFollowing);
          followBtn.classList.toggle("btn-unfollow", !isFollowing);

          followBtn.setAttribute("data-following", (!isFollowing).toString());
        } else {
          showToastTop(result.message || "خطایی رخ داد.", "error");
        }
      } catch (err) {
        console.error("❌ Follow mutation failed:", err);
        showToastTop("خطا در ارتباط با سرور.", "error");
      }
    });
  }
  document.querySelectorAll(".nav-scrollable-item[data-tab]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      document
        .querySelectorAll(".nav-scrollable-item[data-tab]")
        .forEach((b) => {
          b.classList.remove("active");
        });

      btn.classList.add("active");
      const tab = btn.dataset.tab;
      const container = document.getElementById("profile-content");
      if (!container) return;
      container.innerHTML = "";

      if (tab === "blog") {
        const controls = document.createElement("div");
        controls.id = "blog-controls";

        const sortSelector = document.createElement("select");
        sortSelector.id = "sortSelector";
        sortSelector.innerHTML = `
    <option value="latest">جدیدترین</option>
    <option value="oldest">قدیمی‌ترین</option>
  `;

        controls.appendChild(sortSelector);

        const postsContainer = document.createElement("div");
        postsContainer.id = "blog-posts-container";
        postsContainer.innerHTML = "<p>در حال بارگذاری...</p>";

        container.appendChild(controls);
        container.appendChild(postsContainer);

        const loadBlogPosts = async () => {
          const sort = sortSelector.value;
          try {
            const res = await axios.get(`/@${username}/posts/blog?sort=${sort}`);
            postsContainer.innerHTML = res.data;
          } catch (err) {
            postsContainer.innerHTML = "<p>خطا در بارگذاری بلاگ!</p>";
          }
        };

        sortSelector.addEventListener("change", loadBlogPosts);
        loadBlogPosts();
      }
      if (tab === "forum") {
        const controls = document.createElement("div");
        controls.id = "forum-controls";

        const sortSelector = document.createElement("select");
        sortSelector.id = "sortSelector";
        sortSelector.innerHTML = `
    <option value="latest">جدیدترین</option>
    <option value="oldest">قدیمی‌ترین</option>
  `;

        const forumTypeSelector = document.createElement("select");
        forumTypeSelector.id = "forumTypeSelector";
        forumTypeSelector.innerHTML = `
    <option value="all">همه</option>
    <option value="main">پست‌های اصلی</option>
    <option value="reply">ریپلای‌ها</option>
  `;

        controls.appendChild(sortSelector);
        controls.appendChild(forumTypeSelector);

        const postsContainer = document.createElement("div");
        postsContainer.id = "forum-posts-container";
        postsContainer.innerHTML = "<p>در حال بارگذاری...</p>";

        container.appendChild(controls);
        container.appendChild(postsContainer);

        const loadForumPosts = async () => {
          const sort = sortSelector.value;
          const forumType = forumTypeSelector.value;
          try {
            const res = await axios.get(
              `/@${username}/posts/forum?sort=${sort}&forumType=${forumType}`
            );
            postsContainer.innerHTML = res.data;
          } catch (err) {
            postsContainer.innerHTML = "<p>خطا در بارگذاری فروم!</p>";
          }
        };

        sortSelector.addEventListener("change", loadForumPosts);
        forumTypeSelector.addEventListener("change", loadForumPosts);

        loadForumPosts();
      }
    });
  });
});
