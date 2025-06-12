document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("follow-btn");
    const h3Message = document.getElementById("message");
    if (!btn) return;
  
    btn.addEventListener("click", async () => {
      const isFollowing = btn.getAttribute("data-following") === "true";
      const targetId = btn.getAttribute("data-user-id");
  
      const mutation = `
        mutation FollowOrUnfollow($targetId: ID!) {
          ${isFollowing ? "unfollowUser" : "followUser"}(targetId: $targetId) {
            success
            message
          }
        }
      `;
  
      try {
        const res = await axios.post("/graphql", {
          query: mutation,
          variables: { targetId },
        });
  
        const result = res.data.data[isFollowing ? "unfollowUser" : "followUser"];
        if (result.success) {
          const countSpan = document.getElementById("followers-count");
          let count = parseInt(countSpan.innerText, 10) || 0;
          count += isFollowing ? -1 : 1;
          countSpan.innerText = count;
  
          btn.innerText = isFollowing ? "دنبال کردن" : "آنفالو";
          btn.setAttribute("data-following", (!isFollowing).toString());
        }
        h3Message.innerText = result.message;

        // alert(result.message);
      } catch (err) {
        alert("خطا در ارتباط با سرور");
      }
    });
  });
  