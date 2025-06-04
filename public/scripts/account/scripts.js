document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll(".profile-form");

  forms.forEach((form) => {
    const msgBox = form.querySelector(".msg");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const field = form.getAttribute("data-field");
      const value = form.querySelector("input[name='value']").value.trim();

      if (!value) return showMessage("مقدار نمی‌تواند خالی باشد.", "error");

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
        showMessage(err.response?.data?.message || "خطا در ارتباط با سرور", "error");
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
});
