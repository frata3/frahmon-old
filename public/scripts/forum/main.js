import { formatRelativeTime } from "../utils/timeFormat.js";
import { showToastTop } from "../utils/showToast.js";
import { confirmModal } from "../utils/confirmModal.js";
import { currentUser } from "../main/main.js";

window.showPostModal = () => {
  if (!currentUser) return showToastTop("ابتدا وارد شوید");
  document.getElementById("create-post-modal")?.classList.remove("hidden");
  setTimeout(() => {
    document.getElementById("create-modal-input").focus();
  }, 10);
};
window.hidePostModal = () => {
  document.getElementById("create-post-modal")?.classList.add("hidden");
};

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".post-date").forEach((el) => {
    const date = el.getAttribute("data-date");
    if (date) el.textContent = formatRelativeTime(date);
  });
  const textarea = document.getElementById("reply-textarea");
  textarea.addEventListener("input", () => {
    textarea.style.height = "auto"; // reset
    textarea.style.height = textarea.scrollHeight + "px"; // fit to content
  });
  window.showReplyModal = async function (button) {
    const postId = button.dataset.postId;
    if (!postId) return;

    const modal = document.getElementById("reply-modal");
    const parentIdInput = document.getElementById("reply-parent-id");
    const quotedContent = document.getElementById("reply-quoted-content");
    const replyTitle = document.getElementById("reply-title");

    parentIdInput.value = postId;
    quotedContent.innerHTML = `<p>در حال بارگذاری...</p>`;
    replyTitle.innerHTML = `پاسخ به ...`;

    modal.classList.remove("hidden");
    setTimeout(() => {
      document.getElementById("reply-textarea").focus();
    }, 10);

    try {
      const { data } = await axios.post(`/forum/${postId}/meta`);
      const { content, author } = data;

      quotedContent.innerHTML = `
        <div class="reply-meta">
          <img src="${
            author.avatar || "/assets/pictures/header.jpg"
          }" alt="avatar" class="modal-avatar">
          <strong>${author.fullname}</strong>
        </div>
        <p>${content}</p>
      `;
      replyTitle.innerHTML = `پاسخ به <a href="/@${author.username}" class="author-link">@${author.username}</a>`;
    } catch (err) {
      quotedContent.innerHTML = `<p>خطا در بارگذاری اطلاعات</p>`;
    }
  };
  const replyForm = document.getElementById("reply-form");
  replyForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const content = document.getElementById("reply-textarea").value.trim();;
    const parentId = document.getElementById("reply-parent-id").value;

    if (!content) {
      showToastTop("لطفاً محتوای پاسخ را وارد کنید.");
      return;
    }

    try {
      const response = await axios.post("/forum/create", {
        content,
        parentId,
      });

      if (response.status === 201 && response.data.success) {
        showToastTop(response.data.message || "✅ پاسخ با موفقیت ارسال شد");
        replyForm.reset();
        hideReplyModal();
      } else {
        showToastTop("ارسال با مشکل مواجه شد.");
      }
    } catch (error) {
      console.error(error);
      showToastTop("خطا در ارسال پاسخ.");
    }
  });
  window.hideReplyModal = () => {
    document.getElementById("reply-modal")?.classList.add("hidden");
  };
  document.addEventListener("click", async (e) => {
    const btn = e.target.closest(".action-btn");
    if (!btn) return;

    e.stopPropagation();

    if (!currentUser) {
      showToastTop("برای انجام این عملیات ابتدا وارد شوید.", "warning");
      return;
    }

    const postId = btn.dataset.postId;

    if (btn.querySelector("img[src*='reply.svg']")) {
      showReplyModal(btn);
    } else if (btn.querySelector("img[src*='repost.svg']")) {
      showToastTop("ری‌پست هنوز پیاده‌سازی نشده");
    } else if (btn.querySelector("img[src*='like.svg']")) {
      try {
        const res = await axios.post("/forum/like", { postId });
        const liked = res.data.liked;
        const counter = btn.querySelector(".counter.like");
        let count = parseInt(counter.textContent);
        counter.textContent = liked ? count + 1 : count - 1;
        btn.querySelector("img").classList.toggle("liked", liked);
      } catch (err) {
        showToastTop("خطا در لایک کردن");
      }
    }
  });
  document.addEventListener("click", async (e) => {
    const isOptionsBtn = e.target.closest(".more-options-button");
    const openMenus = document.querySelectorAll(
      ".more-options-menu:not(.hidden)"
    );
    openMenus.forEach((menu) => menu.classList.add("hidden"));
    if (isOptionsBtn) {
      const menu =
        isOptionsBtn.parentElement.querySelector(".more-options-menu");

      const buttonRect = isOptionsBtn.getBoundingClientRect();
      const menuHeight = 150;
      const viewportHeight = window.innerHeight;
      const openBelow = buttonRect.bottom + menuHeight < viewportHeight;

      menu.classList.remove("above", "below");
      menu.classList.add(openBelow ? "below" : "above"); 

      const buttonOffsetTop = isOptionsBtn.offsetTop;
      const buttonOffsetLeft = isOptionsBtn.offsetLeft;
      menu.style.top = `${buttonOffsetTop}px`;
      menu.style.left = `${buttonOffsetLeft}px`;

      menu?.classList.toggle("hidden");
      return;
    }

    const copyLinkBtn = e.target.closest(".option-copy-link");
    const deleteBtn = e.target.closest(".option-delete");

    if (copyLinkBtn) {
      const postId = copyLinkBtn.dataset.postId;
      const url = `${window.location.origin}/forum/${postId}`;

      navigator.clipboard
        .writeText(url)
        .then(() => showToastTop("لینک پست کپی شد!"))
        .catch(() => showToastTop("کپی لینک ناموفق بود."));
    }
    if (deleteBtn) {
      const postId = deleteBtn.dataset.postId;
    
      const confirmed = await confirmModal("آیا از حذف این پست اطمینان دارید؟");
      if (!confirmed) return;
    
      try {
        const res = await axios.delete(`/forum/${postId}`);
    
        if (res.status === 200) {
          const postElement = deleteBtn.closest(".post-base");
          if (postElement) postElement.remove();
          showToastTop("پست با موفقیت حذف شد.");
        } else {
          showToastTop("درخواست حذف معتبر نبود. دوباره تلاش کنید.");
        }
    
      } catch (err) {
        console.error(err);
        const msg = err?.response?.data || "خطا در حذف پست. لطفاً دوباره تلاش کنید.";
        showToastTop(msg);
      }
    }

    if (!e.target.closest(".more-options-menu")) {
      document
        .querySelectorAll(".more-options-menu")
        .forEach((m) => m.classList.add("hidden"));
    }
  });
  document.addEventListener("click", async (e) => {
    const followBtn = e.target.closest(".follow-user");
    if (followBtn) {
      if (followBtn.disabled) return;
      const targetId = followBtn.dataset.userId;
      const query = `
        mutation {
          followUser(targetId: "${targetId}") {
            success
            message
          }
        }
      `;
      followBtn.disabled = true;
      const originalText = followBtn.querySelector("span").textContent;
      followBtn.querySelector("span").textContent = "در حال پردازش...";
      try {
        const response = await fetch("/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        });
        const result = await response.json();
        const { success, message } = result.data.followUser;
        if (success) {
          showToastTop(message || "درخواست دنبال‌کردن با موفقیت ارسال شد.");
          followBtn.querySelector("span").textContent = "دنبال‌شده";
          followBtn.classList.add("followed");
        } else {
          showToastTop(message || "خطایی رخ داد.");
          followBtn.querySelector("span").textContent = originalText;
          followBtn.disabled = false;
        }
      } catch (err) {
        console.error(err);
        showToastTop("خطا در ارتباط با سرور");
        followBtn.querySelector("span").textContent = originalText;
        followBtn.disabled = false;
      }
    }
  });
});
