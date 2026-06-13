document.addEventListener("DOMContentLoaded", () => {
  let attrIndex = 1;
    const container = document.getElementById("attributes-container");
    const addBtn = document.getElementById("btn-add");

    // اضافه کردن attribute جدید
    addBtn.addEventListener("click", () => {
      const div = document.createElement("div");
      div.classList.add("attribute-pair");
      div.innerHTML = `
        <input type="text" name="attributes[${attrIndex}][key]" placeholder="Key" required />
        <input type="text" name="attributes[${attrIndex}][value]" placeholder="Value" required />
        <button type="button" class="btn-remove">✕</button>
      `;
      container.appendChild(div);
      attrIndex++;
    });

    // حذف attribute (event delegation)
    container.addEventListener("click", (e) => {
      if (e.target.classList.contains("btn-remove")) {
        e.target.parentElement.remove();
      }
    });
});