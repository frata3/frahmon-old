document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("edit-modal");
  const closeModal = document.querySelector(".close-btn");
  const editForm = document.getElementById("edit-form");
  const fieldInputContainer = document.getElementById("field-value");
  const fieldNameInput = document.getElementById("field-name");
  const modalTitle = document.getElementById("modal-title");
  const modalDescription = document.getElementById("modal-description");
  const editButtons = document.querySelectorAll(".edit-btn");
  const modalMessage = document.getElementById("modal-message");

  editButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const field = e.target.getAttribute("data-field");
      const label = e.target.getAttribute("data-label");
      const description = e.target.getAttribute("data-description");

      fieldNameInput.value = field;
      modalTitle.innerText = `ویرایش ${label}`;
      modalDescription.innerText = description;

      fieldInputContainer.innerHTML = "";

      if (field === "password") {
        fieldInputContainer.innerHTML = `
                    <input type="password" id="new-password" placeholder="رمز عبور جدید" required>
                    <input type="password" id="confirm-password" placeholder="تکرار رمز عبور" required>
                `;
      } else {
        fieldInputContainer.innerHTML = `<input type="text" id="field-input" name="value" value="${
          document.getElementById(field).innerText
        }">`;
      }

      modal.style.display = "flex";
    });
  });

  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
    modalMessage.style.display = "none";
    modalMessage.textContent = "";
  });

  editForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const field = fieldNameInput.value;
    let value;

    if (field === "password") {
      const newPassword = document.getElementById("new-password").value.trim();
      const confirmPassword = document
        .getElementById("confirm-password")
        .value.trim();

      if (!newPassword || !confirmPassword) {
        showMessage("لطفاً هر دو فیلد را پر کنید.", "error");
        return;
      }

      if (newPassword !== confirmPassword) {
        showMessage("رمز عبور و تکرار آن مطابقت ندارند.", "error");
        return;
      }

      value = newPassword;
    } else {
      value = document.getElementById("field-input").value.trim();
      if (!value) {
        showMessage("لطفاً مقدار را وارد کنید.", "error");
        return;
      }
    }

    const submitButton = editForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = "در حال ذخیره...";

    fetch("/nest/update-personal-info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ field, value }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(errorData.message || "خطا در ارتباط با سرور");
          });
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          if (field !== "password") {
            document.getElementById(field).textContent = value;
          }
          showMessage(
            data.message || "اطلاعات با موفقیت بروزرسانی شد.",
            "success"
          );
        } else {
          showMessage(data.message || "خطا در بروزرسانی اطلاعات", "error");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        showMessage(error.message || "خطا در ارتباط با سرور", "error");
      })
      .finally(() => {
        submitButton.disabled = false;
        submitButton.textContent = "ذخیره";
      });
  });

  function showMessage(message, type) {
    modalMessage.textContent = "";
    modalMessage.className = `modal-message ${type}`;
    modalMessage.style.display = "block";
    modalMessage.textContent = message;
  }

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
        modalMessage.style.display = "none";
        modalMessage.textContent = "";
    }
  });
});
