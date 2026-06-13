import { showToastTop } from "../utils/showToast.js";
import { confirmModal } from "../utils/confirmModal.js";

document.addEventListener("DOMContentLoaded", () => {
  // Handle adding new discount
  const discountBtn = document.querySelector(".btn-submit-discount");
  if (discountBtn) {
    discountBtn.addEventListener("click", async () => {
      await applyDiscount();
    });
  }

  // Handle Enter key press in discount input
  const discountInput = document.getElementById("discountCode");
  if (discountInput) {
    discountInput.addEventListener("keypress", async (e) => {
      if (e.key === "Enter") {
        await applyDiscount();
      }
    });
  }

  // Handle removing discounts
  const removeButtons = document.querySelectorAll(".btn-remove-discount");
  removeButtons.forEach(button => {
    button.addEventListener("click", async () => {
      const discountId = button.getAttribute("data-discount-id");
      const orderId = button.getAttribute("data-order-id");
      await removeDiscount(discountId, orderId);
    });
  });
});

async function applyDiscount() {
  const discountBtn = document.querySelector(".btn-submit-discount");
  const orderId = discountBtn.getAttribute("data-order-id");
  const discountCode = document.getElementById("discountCode").value.trim();
  
  if (!discountCode) {
    showToastTop("لطفاً کد تخفیف را وارد کنید");
    return;
  }

  // Disable button and show loading state
  discountBtn.disabled = true;
  const originalText = discountBtn.innerHTML;
  discountBtn.innerHTML = "<span>در حال اعمال...</span>";

  try {
    const res = await axios.post(
      `/market/discount/apply/${discountCode}/${orderId}`
    );
    const data = res.data;

    if (!data.success) {
      return showToastTop(data.message);
    }

    // Update order info
    updateOrderInfo(data);
    
    // Add new discount to the applied discounts list
    addDiscountToList(data);
    
    // Clear input
    document.getElementById("discountCode").value = "";
    
    // Update breakdown if provided
    if (data.appliedDiscounts) {
      updateDiscountBreakdown(data.appliedDiscounts);
    }

    showToastTop("کد تخفیف با موفقیت اعمال شد!");
    
    // Refresh page after 1 second to show updated data
    // setTimeout(() => {
    //   window.location.reload();
    // }, 1000);

  } catch (err) {
    console.error(err);
    showToastTop(
      err.response?.data?.message ||
        "خطا در اعمال تخفیف، لطفاً دوباره امتحان کنید"
    );
  } finally {
    // Re-enable button
    discountBtn.disabled = false;
    discountBtn.innerHTML = originalText;
  }
}

async function removeDiscount(discountId, orderId) {
  const confirmed = await confirmModal("آیا از حذف این کد تخفیف اطمینان دارید؟");
  if (!confirmed) return;

  try {
    const res = await axios.delete(
      `/market/discount/remove/${discountId}/${orderId}`
    );
    const data = res.data;

    if (!data.success) {
      return showToastTop(data.message);
    }

    // Update order info
    updateOrderInfo(data);
    
    // Remove discount from UI
    const discountElement = document.querySelector(`[data-discount-id="${discountId}"]`);
    if (discountElement) {
      discountElement.remove();
    }

    // Check if no discounts remain
    const remainingDiscounts = document.querySelectorAll(".applied-discount-item");
    if (remainingDiscounts.length === 0) {
      const appliedDiscountsContainer = document.querySelector(".applied-discounts");
      appliedDiscountsContainer.innerHTML = '<p class="no-discounts">هیچ کد تخفیفی اعمال نشده است</p>';
    }

    showToastTop("کد تخفیف با موفقیت حذف شد!");

  } catch (err) {
    console.error(err);
    showToastTop(
      err.response?.data?.message ||
        "خطا در حذف تخفیف، لطفاً دوباره امتحان کنید"
    );
  }
}

function updateOrderInfo(data) {
  const orderContainer = document.querySelector(".order-container");
  
  // Update total amount
  const totalAmountElement = orderContainer.querySelector(".total-amount");
  if (totalAmountElement && data.total_amount) {
    totalAmountElement.textContent = `مبلغ کل: ${data.total_amount} تومان`;
  }
  
  // Update discount amount
  const discountAmountElement = orderContainer.querySelector(".discount-amount");
  if (discountAmountElement && data.totalDiscountAmount !== undefined) {
    discountAmountElement.textContent = `تخفیف: ${data.totalDiscountAmount} تومان`;
  }
  
  // Update final amount
  const finalAmountElement = orderContainer.querySelector(".final-amount");
  if (finalAmountElement && data.finalTotal !== undefined) {
    finalAmountElement.textContent = `مبلغ نهایی: ${data.finalTotal} تومان`;
  }
}

function addDiscountToList(data) {
  const appliedDiscountsContainer = document.querySelector(".applied-discounts");
  const noDiscountsMessage = appliedDiscountsContainer.querySelector(".no-discounts");
  
  // Remove "no discounts" message if it exists
  if (noDiscountsMessage) {
    noDiscountsMessage.remove();
  }

  // Create new discount element
  const newDiscountElement = document.createElement("div");
  newDiscountElement.className = "applied-discount-item";
  newDiscountElement.setAttribute("data-discount-id", data.discountId || "new");
  const discountValue = data.discount.discount.toString();
  const isPercentage = data.discount.isPercentage;
  console.log(data);
  newDiscountElement.innerHTML = `
    <span class="discount-code">کد: <mark>${data.discount.discountCode || 'جدید'}</mark></span>
    <span class="discount-value">
      ${isPercentage ? `درصد: <mark>${discountValue}%</mark>` : `مبلغ: <mark>${discountValue} تومان</mark>`}
    </span>
    <span class="discount-type">نوع: ${data.discount.discountType === 'product' ? 'محصول' : 'سبد خرید'}</span>
    <button class="btn-remove-discount" data-discount-id="${data.discountId || 'new'}" data-order-id="${data.orderId}">
      حذف
    </button>
  `;
  
  appliedDiscountsContainer.appendChild(newDiscountElement);
  
  // Add event listener to the new remove button
  const newRemoveButton = newDiscountElement.querySelector(".btn-remove-discount");
  newRemoveButton.addEventListener("click", async () => {
    const discountId = newRemoveButton.getAttribute("data-discount-id");
    const orderId = newRemoveButton.getAttribute("data-order-id");
    await removeDiscount(discountId, orderId);
  });
}

function updateDiscountBreakdown(appliedDiscounts) {
  // This function can be used to update discount breakdown if you want to show it
  // without refreshing the page
  console.log("Applied discounts:", appliedDiscounts);
}