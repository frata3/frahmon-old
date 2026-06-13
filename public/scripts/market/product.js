import { formatRelativeTime } from "../utils/timeFormat.js";
import { showToastTop } from "../utils/showToast.js";
import { confirmModal } from "../utils/confirmModal.js";
import { currentUser } from "../main/main.js";

document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click", async (e) => {
    const addBtn = e.target.closest(".btn-add-to-cart");
    const incBtn = e.target.closest(".btn-increase");
    const decBtn = e.target.closest(".btn-decrease");

    if (!currentUser) {
      return showToastTop("ابتدا وارد شوید");
    }

    if (addBtn) {
      handleAdd(addBtn.dataset.productId, addBtn.dataset.sellerId, addBtn);
    }
    if (incBtn) {
      const parent = incBtn.closest(".quantity-controls");
      handleAdd(parent.dataset.productId, parent.dataset.sellerId, parent, true);
    }
    if (decBtn) {
      const parent = decBtn.closest(".quantity-controls");
      handleRemove(parent.dataset.productId, parent.dataset.sellerId, parent);
    }
  });
  async function handleAdd(productId, sellerId, el, isIncrease = false) {
    try {
      const res = await axios.post(
        `/market/basket/add/${productId}/${sellerId}`
      );
      const { success, message } = res.data;

      if (success) {
        showToastTop(message || "محصول اضافه شد");

        if (isIncrease) {
          const qtyEl = el.querySelector(".quantity");
          qtyEl.textContent = parseInt(qtyEl.textContent) + 1;
        } else {
          el.outerHTML = `
          <div class="quantity-controls" data-product-id="${productId}" data-seller-id="${sellerId}">
            <button class="btn-decrease">➖</button>
            <span class="quantity">1</span>
            <button class="btn-increase">➕</button>
          </div>
        `;
        }
      } else {
        showToastTop(message || "خطا در افزودن محصول");
      }
    } catch (err) {
      console.error(err);
      showToastTop("خطا در ارتباط با سرور");
    }
  }
  async function handleRemove(productId, sellerId, el) {
    try {
      const res = await axios.delete(`/market/basket/remove/${productId}/${sellerId}`);
      const { success, message, remaining } = res.data;
  
      if (!success) {
        return showToastTop(message || "خطا در حذف محصول");
      }
  
      if (remaining === 0) {
        const newBtn = document.createElement("button");
        newBtn.className = "btn-add-to-cart";
        newBtn.dataset.productId = productId;
        newBtn.dataset.sellerId = sellerId;
        newBtn.innerHTML = `<span>➕ افزودن به سبد خرید</span>`;
        el.replaceWith(newBtn);
      } else {
        const qtyEl = el.querySelector(".quantity");
        if (qtyEl) qtyEl.textContent = remaining;
      }
  
    } catch (err) {
      console.error(err);
      showToastTop("خطا در ارتباط با سرور");
    }
  }
   
});
