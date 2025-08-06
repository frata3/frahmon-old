export function confirmModal(message = "آیا اطمینان دارید؟") {
    return new Promise((resolve) => {
      const modal = document.getElementById("confirm-modal");
      const msg = document.getElementById("confirm-message");
      const yesBtn = document.getElementById("confirm-yes");
      const noBtn = document.getElementById("confirm-no");
  
      msg.textContent = message;
      modal.classList.remove("hidden");
  
      const cleanUp = () => {
        modal.classList.add("hidden");
        yesBtn.removeEventListener("click", onYes);
        noBtn.removeEventListener("click", onNo);
      };
  
      const onYes = () => {
        cleanUp();
        resolve(true);
      };
  
      const onNo = () => {
        cleanUp();
        resolve(false);
      };
  
      yesBtn.addEventListener("click", onYes);
      noBtn.addEventListener("click", onNo);
    });
  }
  