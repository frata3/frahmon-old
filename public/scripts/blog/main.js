// import Masonry from "masonry-layout";
import { confirmModal } from "../utils/confirmModal.js";
import { showToastTop } from "../utils/showToast.js";
import { formatRelativeTime } from "../utils/timeFormat.js";

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".blog-grid");

  if (grid && window.Masonry) {
    new Masonry(grid, {
      itemSelector: '.post',
      gutter: 20, // فاصله بین پست‌ها
      fitWidth: true, // عرض رو به اندازه محتوا تنظیم کنه
    });
  }

  document.addEventListener("click", async (e) => {
    const isOptionsBtn = e.target.closest(".more-options-button");
const openMenus = document.querySelectorAll(".more-options-menu:not(.hidden)");
openMenus.forEach((menu) => menu.classList.add("hidden"));

if (isOptionsBtn) {
  const menu = isOptionsBtn.parentElement.querySelector(".more-options-menu");

  menu.classList.remove("below");
  menu.classList.add("above");

  // const buttonRect = isOptionsBtn.getBoundingClientRect();
  const menuHeight = 150; // یا مقدار دقیق‌تر بسته به طراحی‌ات
  const buttonOffsetTop = isOptionsBtn.offsetTop;
  const buttonOffsetLeft = isOptionsBtn.offsetLeft;

  menu.style.top = `${buttonOffsetTop - menuHeight}px`;
  menu.style.left = `${buttonOffsetLeft}px`;

  menu?.classList.toggle("hidden");
  return;
}


    const copyLinkBtn = e.target.closest(".option-copy-link");
    const deleteBtn = e.target.closest(".option-delete");

    if (copyLinkBtn) {
      const postId = copyLinkBtn.dataset.postId;
      const url = `${window.location.origin}/blog/${postId}`;

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
        const res = await axios.delete(`/blog/${postId}`);

        if (res.status === 200) {
          // const postElement = deleteBtn.closest(".post");
          // if (postElement) postElement.remove();
          showToastTop("پست با موفقیت حذف شد.");
        } else {
          showToastTop("درخواست حذف معتبر نبود. دوباره تلاش کنید.");
        }
      } catch (err) {
        console.error(err);
        const msg =
          err?.response?.data || "خطا در حذف پست. لطفاً دوباره تلاش کنید.";
        showToastTop(msg);
      }
    }

    if (!e.target.closest(".more-options-menu")) {
      document
        .querySelectorAll(".more-options-menu")
        .forEach((m) => m.classList.add("hidden"));
    }
  });
});
