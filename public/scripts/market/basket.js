import { formatRelativeTime } from "../utils/timeFormat.js";
import { showToastTop } from "../utils/showToast.js";
import { confirmModal } from "../utils/confirmModal.js";
import { currentUser } from "../main/main.js";

document.addEventListener("DOMContentLoaded", async () => {
  const baskets = [...document.querySelectorAll(".footer-basket")];
  const basketIds = baskets.map(b => 
    b.querySelector(".btn-add-to-order").dataset.basketId
  );
  try {
    const existOrder = await axios.post("/market/order/exist", {
      basketIds,
    });
    const { data } = existOrder.data;
    baskets.forEach(basket => {
      const addBtn = basket.querySelector(".btn-add-to-order");
      const spanAdd = addBtn.querySelector(".btn-value-add");
      const id = addBtn.dataset.basketId;

      if (data[id] && data[id].hasOrder === true) {
        spanAdd.textContent = "ادامه ثبت سفارش";
      } else {
        spanAdd.textContent = "ثبت سفارش";
      }
    });
  } catch (err) {
    console.error("Error checking baskets:", err);
  }
  document.addEventListener("click", async (e) => {
    const submitBtn = e.target.closest(".btn-add-to-order");
    const removeBtn = e.target.closest(".btn-remove-basket");

    if (!currentUser) {
      return showToastTop("ابتدا وارد شوید");
    }

    if (submitBtn) {
      handleSubmit(submitBtn.dataset.basketId, submitBtn);
    }
    if (removeBtn) {
      const parent = incBtn.closest(".quantity-controls");
      handleRemove(
        parent.dataset.productId,
        parent.dataset.sellerId,
        parent,
        true
      );
    }
  });
  async function handleSubmit(basketId) {
    try {
      const res = await axios.post(`/market/order/new/${basketId}`);
      const { success, message, orderId } = res.data;
      if (success) {
        showToastTop(message || "سفارش در انتظار پرداخت ");
        window.open(`/market/order/${orderId}`);
      } else {
        showToastTop(message || "خطا در ساخت سفارش");
      }
    } catch (err) {
      console.error(err);
      showToastTop("خطا در ارتباط با سرور");
    }
  }
  async function handleRemove(productId, sellerId, el) {
    try {
      const res = await axios.delete(
        `/market/basket/remove/${productId}/${sellerId}`
      );
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
