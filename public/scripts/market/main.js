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

      if (tab === "baskets") {
        try {
        const res = await axios.get("/market/basket");
        const { success, message } = res.data;
        if (success) {
          window.location.href = "/market/basket";
        } else {
          showToastTop(message);
        }
      } catch (err) {
        console.error(err);
        showToastTop("خطا در ارتباط با سرور");
        addToCartBtn.querySelector("span").textContent = originalText;
        addToCartBtn.disabled = false;
      }}
    });
  });
});