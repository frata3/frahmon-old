document.addEventListener("DOMContentLoaded", () => {
  let selectedCategory = null;
  let selectedTopic = null;
  let selectedTags = [];
  // جستجوی دسته‌بندی
  document
    .getElementById("categoryInput")
    .addEventListener("input", async function () {
      const query = this.value.trim();
      if (query.length < 2) return;

      const response = await fetch(`/categories/search?query=${query}`);
      const categories = await response.json();
      console.log(typeof categories);
      console.log("test 1 : "+query+" --- "+" --- "+ categories)
      const suggestions = categories
        .map(
          (c) =>
            `<div class="suggestItems" onclick="selectCategory('${c._id}', '${c.name}')">${c.name}</div>`
        )
        .join("");
      document.getElementById("categorySuggestions").innerHTML = suggestions;
    });

  window.selectCategory = function (id, name) {
    selectedCategory = id;
    document.getElementById("selectedCategory").value = id;
    document.getElementById("categoryInput").value = name;
    document.getElementById("categorySuggestions").innerHTML = "";
    document.getElementById("topicInput").disabled = false;
  };

  // جستجوی موضوع
  document
    .getElementById("topicInput")
    .addEventListener("input", async function () {
      const query = this.value.trim();
      if (query.length < 2 || !selectedCategory) return;

      const response = await fetch(
        `/topics/search?query=${query}&categoryId=${selectedCategory}`
      );
      const topics = await response.json();
      console.log(typeof topics);
      console.log("test 1 : "+query+" --- "+" --- "+ topics)
      const suggestions = topics
        .map(
          (t) =>
            `<div class="suggestItems" onclick="selectTopic('${t._id}', '${t.name}')">${t.name}</div>`
        )
        .join("");
      document.getElementById("topicSuggestions").innerHTML = suggestions;
    });

  window.selectTopic = function (id, name) {
    selectedTopic = id;
    document.getElementById("selectedTopic").value = id;
    document.getElementById("topicInput").value = name;
    document.getElementById("topicSuggestions").innerHTML = "";
    document.getElementById("tagInput").disabled = false;
  };

  // جستجوی تگ‌ها
  document
    .getElementById("tagInput")
    .addEventListener("input", async function () {
      const query = this.value.trim();
      if (query.length < 2 || !selectedTopic) return;

      const response = await fetch(
        `/tags/search?query=${query}&topicId=${selectedTopic}`
      );
      const tags = await response.json();

      const suggestions = tags
        .map(
          (t) =>
            `<div class="suggestItems" onclick="selectTag('${t._id}', '${t.name}')">${t.name}</div>`
        )
        .join("");
      document.getElementById("tagSuggestions").innerHTML = suggestions;
    });

  window.selectTag = function (id, name) {
    if (!selectedTags.some((tag) => tag.id === id)) {
      selectedTags.push({ id, name });
      updateTagList();
    }
  };

  function updateTagList() {
    document.getElementById("selectedTagsList").innerHTML = selectedTags
      .map(
        (tag) =>
          `<li class="suggestItems">${tag.name} <span onclick="removeTag('${tag.id}')">❌</span></li>`
      )
      .join("");
    document.getElementById("selectedTags").value = selectedTags
      .map((tag) => tag.id)
      .join(",");
  }

  window.removeTag = function (id) {
    selectedTags = selectedTags.filter((tag) => tag.id !== id);
    updateTagList();
  };
});
