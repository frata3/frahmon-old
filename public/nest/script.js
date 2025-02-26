document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("edit-modal");
    const closeModal = document.querySelector(".close-btn");
    const editForm = document.getElementById("edit-form");
    const fieldInput = document.getElementById("field-value");
    const fieldNameInput = document.getElementById("field-name");
    const modalTitle = document.getElementById("modal-title");
    const modalDescription = document.getElementById("modal-description");
    const editButtons = document.querySelectorAll(".edit-btn");
    const modalMessage = document.getElementById("modal-message");
    const passwordDisplay = document.getElementById("password-display");
    const togglePasswordButton = document.getElementById("toggle-password");
    let isPasswordVisible = false;

    editButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            const field = e.target.getAttribute("data-field");
            const label = e.target.getAttribute("data-label");
            const description = e.target.getAttribute("data-description");

            fieldNameInput.value = field;
            fieldInput.value = document.getElementById(field).innerText;
            modalTitle.innerText = `ویرایش ${label}`;
            modalDescription.innerText = description;

            modal.style.display = "flex";
        });
    });

    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
        fieldInput.value = "";
        fieldNameInput.value = "";
        modalTitle.innerText = "";
        modalDescription.innerText = "";
    });

    togglePasswordButton.addEventListener("click", (e) => {
        e.preventDefault();

        if (isPasswordVisible) {
            passwordDisplay.textContent = "********";
            togglePasswordButton.textContent = "👁️";
        } else {
            fetch("/nest/update-user-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({}),
            })
                .then((response) => {
                    console.log(response);
                    if (!response.ok) {
                        throw new Error("خطا در دریافت رمز عبور");
                    }
                    return response.json();
                })
                .then((data) => {
                    if (data.success) {
                        passwordDisplay.textContent = data.password;
                        togglePasswordButton.textContent = "🙈";
                    } else {
                        alert(data.message || "خطا در دریافت رمز عبور");
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                    alert("خطا در ارتباط با سرور");
                });
        }

        isPasswordVisible = !isPasswordVisible;
    });

    editForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const field = fieldNameInput.value;
        const value = fieldInput.value.trim();

        if (!value) {
            showMessage("لطفاً مقدار را وارد کنید.", "error");
            return;
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
                    document.getElementById(field).textContent = value;
                    showMessage(data.message || "اطلاعات با موفقیت بروزرسانی شد.", "success");
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
        modalMessage.textContent = message;
        modalMessage.className = `modal-message ${type}`;
        modalMessage.style.display = "block";
    }

    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
            fieldInput.value = "";
            fieldNameInput.value = "";
            modalTitle.innerText = "";
            modalDescription.innerText = "";
        }
    });
});