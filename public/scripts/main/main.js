const toggleBtn = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

const setTheme = (mode) => {
  if (mode === "dark") {
    document.documentElement.classList.add("dark-mode");
    themeIcon.src = "/assets/pictures/icons/theme-sun.svg";
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark-mode");
    themeIcon.src = "/assets/pictures/icons/theme-moon.svg";
    localStorage.setItem("theme", "light");
  }
};

toggleBtn.addEventListener("click", () => {
  const isDark = document.documentElement.classList.toggle("dark-mode");
  if (isDark) {
    setTheme("dark");
  } else {
    setTheme("light");
  }
});

window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  setTheme(savedTheme === "dark" ? "dark" : "light");
});
