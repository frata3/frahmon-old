// document.addEventListener("DOMContentLoaded", () => {
//   let selectedCategory = null;
//   let selectedTopic = null;
//   let selectedTags = [];

//   const inputMap = [ 
//     {
//       inputId: "categoryInput",
//       suggestionBoxId: "categorySuggestions",
//       api: (query) => `/categories/search?query=${query}`,
//       onSelect: (id, name) => {
//         selectedCategory = id;
//         document.getElementById("selectedCategory").value = id;
//         document.getElementById("topicInput").disabled = false;
//       },
//     },
//     {
//       inputId: "topicInput",
//       suggestionBoxId: "topicSuggestions",
//       api: (query) =>
//         `/topics/search?query=${query}&categoryId=${selectedCategory}`,
//       onSelect: (id, name) => {
//         selectedTopic = id;
//         document.getElementById("selectedTopic").value = id;
//         document.getElementById("tagInput").disabled = false;
//       },
//     },
//     {
//       inputId: "tagInput",
//       suggestionBoxId: "tagSuggestions",
//       api: (query) => `/tags/search?query=${query}&topicId=${selectedTopic}`,
//       onSelect: (id, name) => {
//         if (!selectedTags.some((t) => t.id === id)) {
//           selectedTags.push({ id, name });
//           updateTagList();
//         }
//       },
//     },
//   ];

//   inputMap.forEach(({ inputId, suggestionBoxId, api, onSelect }) => {
//     const input = document.getElementById(inputId);
//     const suggestionBox = document.getElementById(suggestionBoxId);

//     input.addEventListener("input", async () => {
//       const query = input.value.trim();
//       if (query.length < 2) return (suggestionBox.innerHTML = "");

//       try {
//         const res = await axios.get(api(query));
//         const items = res.data;

//         suggestionBox.innerHTML = items
//           .map(
//             (item) =>
//               `<div class="suggest-item" onclick="selectItem('${inputId}', '${item._id}', '${item.name}')">${item.name}</div>`
//           )
//           .join("");
//       } catch (err) {
//         suggestionBox.innerHTML = `<div class="suggest-item error">خطا در دریافت اطلاعات</div>`;
//       }
//     });
//   });

//   window.selectItem = function (inputId, id, name) {
//     const input = document.getElementById(inputId);
//     input.value = name;

//     const item = inputMap.find((i) => i.inputId === inputId);
//     if (item) {
//       document.getElementById(item.suggestionBoxId).innerHTML = "";
//       item.onSelect(id, name);
//     }
//   };

//   window.removeTag = function (id) {
//     selectedTags = selectedTags.filter((tag) => tag.id !== id);
//     updateTagList();
//   };

//   function updateTagList() {
//     document.getElementById("selectedTagsList").innerHTML = selectedTags
//       .map(
//         (tag) =>
//           `<li class="tag-item">${tag.name} <span class="remove-tag" onclick="removeTag('${tag.id}')">×</span></li>`
//       )
//       .join("");
//     document.getElementById("selectedTags").value = selectedTags
//       .map((t) => t.id)
//       .join(",");
//   }
// });
