// import { formatRelativeTime } from "../utils/timeFormat.js";

// document.addEventListener("DOMContentLoaded", () => {
//   const replyForm = document.getElementById("reply-form");
//   const repliesList = document.getElementById("replies-list");

//   if (replyForm) {
//     replyForm.addEventListener("submit", async (e) => {
//       e.preventDefault();

//       if (!window.currentUser) {
//         alert("برای ارسال پاسخ ابتدا وارد شوید.");
//         return;
//       }

//       const content = e.target.content.value;
//       const parentId = e.target.parentId?.value;
//       const tempId = "temp-" + Date.now();

//       const tempDiv = document.createElement("div");
//       tempDiv.className = "reply-card sending";
//       tempDiv.dataset.tempId = tempId;
//       tempDiv.dataset.content = content;
//       tempDiv.dataset.parentId = parentId || "";

//       tempDiv.innerHTML = `
//           <div class="reply-card">
//             <div class="post-base">
//               <div class="post-header">
//                 <a href="/@${window.currentUser.username}" class="author-name" onclick="event.stopPropagation()">
//                   <img src="${window.currentUser.avatar || "/assets/pictures/header.jpg"}" alt="reply-avatar" class="reply-avatar">
//                 </a>
//                 <div class="post-header-left">
//                   <div class="reply-meta">
//                     <a href="/@${window.currentUser.username}" class="author-name" onclick="event.stopPropagation()">
//                       <strong>${window.currentUser.fullname}</strong>
//                       <span class="username">${window.currentUser.username}@</span>
//                     </a>
//                   </div>
//                   <img src="/assets/pictures/icons/point.svg" class="svg-icon time-split">
//                   <time class="post-date">${formatRelativeTime(new Date())}</time>
//                 </div>
//                 <div class="post-header-right">
//                   <button class="more-options-button" onclick="event.stopPropagation()">
//                     <img src="/assets/pictures/icons/more.svg" class="svg-icon more">
//                   </button>
//                 </div>
//               </div>
//               <p class="post-content">${content.length > 280 ? content.slice(0, 280) + "..." : content}</p>
//               <div class="post-actions"><span class="sending-label">در حال ارسال...</span></div>
//             </div>
//           </div>
//         `;
//       repliesList.appendChild(tempDiv);
//       e.target.reset();

//       try {
//         const res = await axios.post("/forum/create", { content, parentId });
//         const reply = res.data;

//         const realDiv = document.createElement("div");
//         realDiv.className = "reply-card";
//         realDiv.dataset.href = `/forum/${reply.id}`;

//         realDiv.innerHTML = `
//             <div class="reply-card">
//               <div class="post-base" data-href="/forum/${reply.id}">
//                 <div class="post-header">
//                   <a href="/@${reply.author.username}" class="author-name" onclick="event.stopPropagation()">
//                     <img src="${reply.author.avatar || "/assets/pictures/header.jpg"}" alt="reply-avatar" class="reply-avatar">
//                   </a>
//                   <div class="post-header-left">
//                     <div class="reply-meta">
//                       <a href="/@${reply.author.username}" class="author-name" onclick="event.stopPropagation()">
//                         <strong>${reply.author.fullname}</strong>
//                         <span class="username">${reply.author.username}@</span>
//                       </a>
//                     </div>
//                     <img src="/assets/pictures/icons/point.svg" class="svg-icon time-split">
//                     <time class="post-date" data-date="${reply.createdAt}">${formatRelativeTime(reply.createdAt)}</time>
//                   </div>
//                   <div class="post-header-right">
//                     <button class="more-options-button" onclick="event.stopPropagation()">
//                       <img src="/assets/pictures/icons/more.svg" class="svg-icon more">
//                     </button>
//                   </div>
//                 </div>
//                 <p class="post-content">${reply.content.length > 280 ? reply.content.slice(0, 280) + "..." : reply.content}</p>
//                 <div class="post-actions">
//                   <!-- اکشن‌های مربوط به ریپلای -->
//                 </div>
//               </div>
//             </div>
//           `;

//         const temp = document.querySelector(`[data-temp-id="${tempId}"]`);
//         if (temp) {
//           repliesList.replaceChild(realDiv, temp);
//         }
//       } catch (err) {
//         const temp = document.querySelector(`[data-temp-id="${tempId}"]`);
//         if (temp) {
//           temp.querySelector(".sending-label")?.remove();
//           temp.classList.add("error");
//           temp.innerHTML += `
//             <div class="error-controls">
//               <span class="error-label">❌ ارسال نشد</span>
//               <button class="retry-button">ارسال مجدد</button>
//             </div>
//           `;

//           const retryButton = temp.querySelector(".retry-button");
//           if (retryButton) {
//             retryButton.addEventListener("click", async () => {
//               retryButton.disabled = true;
//               retryButton.textContent = "در حال ارسال...";

//               try {
//                 const content = temp.dataset.content;
//                 const parentId = temp.dataset.parentId || null;

//                 const res = await axios.post("/forum/create", { content, parentId });
//                 const reply = res.data;

//                 const realDiv = document.createElement("div");
//                 realDiv.className = "reply-card";
//                 realDiv.dataset.href = `/forum/${reply.id}`;
//                 realDiv.innerHTML = `
//                   <div class="reply-card">
//                     <div class="post-base" data-href="/forum/${reply.id}">
//                       <div class="post-header">
//                         <a href="/@${reply.author.username}" class="author-name" onclick="event.stopPropagation()">
//                           <img src="${reply.author.avatar || "/assets/pictures/header.jpg"}" alt="reply-avatar" class="reply-avatar">
//                         </a>
//                         <div class="post-header-left">
//                           <div class="reply-meta">
//                             <a href="/@${reply.author.username}" class="author-name" onclick="event.stopPropagation()">
//                               <strong>${reply.author.fullname}</strong>
//                               <span class="username">${reply.author.username}@</span>
//                             </a>
//                           </div>
//                           <img src="/assets/pictures/icons/point.svg" class="svg-icon time-split">
//                           <time class="post-date" data-date="${reply.createdAt}">${formatRelativeTime(reply.createdAt)}</time>
//                         </div>
//                         <div class="post-header-right">
//                           <button class="more-options-button" onclick="event.stopPropagation()">
//                             <img src="/assets/pictures/icons/more.svg" class="svg-icon more">
//                           </button>
//                         </div>
//                       </div>
//                       <p class="post-content">${reply.content.length > 280 ? reply.content.slice(0, 280) + "..." : reply.content}</p>
//                       <div class="post-actions"></div>
//                     </div>
//                   </div>
//                 `;
//                 repliesList.replaceChild(realDiv, temp);
//               } catch (retryErr) {
//                 retryButton.textContent = "❌ شکست خورد";
//                 retryButton.disabled = false;
//                 console.error("Retry failed:", retryErr);
//               }
//             });
//           }
//         }

//         alert("خطا در ارسال پاسخ");
//         console.error(err);
//       }
//     });
//   }
// });
