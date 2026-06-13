document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".nav-scrollable-item[data-tab]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      document
        .querySelectorAll(".nav-scrollable-item[data-tab]")
        .forEach((b) => {
          b.classList.remove("active");
        });

      btn.classList.add("active");
      const tab = btn.dataset.tab;
      const container = document.getElementById("me-content");
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
            const res = await axios.get(`/me/posts/blog?sort=${sort}`);
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
              `/me/posts/forum?sort=${sort}&forumType=${forumType}`
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
      if (tab === "users") {
        try {
          const res = await axios.get(`/me/users`);
          container.innerHTML = res.data;
        } catch (err) {
          container.innerHTML = "<p>خطا در بارگذاری!</p>";
        }
      }
      if (tab === "account") {
        try {
          const res = await axios.get(`/me/account`);
          container.innerHTML = res.data;
        } catch (err) {
          container.innerHTML = "<p>خطا در بارگذاری!</p>";
        }
        const forms = document.querySelectorAll(".profile-form");
        forms.forEach((form) => {
          const msgBox = form.querySelector(".msg");

          form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const field = form.getAttribute("data-field");
            const value = form
              .querySelector("input[name='value']")
              .value.trim();

            if (!value)
              return show("مقدار نمی‌تواند خالی باشد.", "error");

            try {
              const res = await axios.post("/me/update-personal-info", {
                field,
                value,
              });

              if (res.data.success) {
                showMessage(res.data.message || "ذخیره شد.", "success");
              } else {
                showMessage(res.data.message || "خطا در ذخیره‌سازی.", "error");
              }
            } catch (err) {
              showMessage(
                err.response?.data?.message || "خطا در ارتباط با سرور",
                "error"
              );
            }

            function showMessage(msg, type) {
              msgBox.textContent = msg;
              msgBox.className = `msg ${type}`;
              msgBox.style.display = "block";
              setTimeout(() => {
                msgBox.style.display = "none";
              }, 3000);
            }
          });
        });
      }
    });
  });
});