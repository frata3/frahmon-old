const form = document.getElementById("auth-form");
const emailGroup = document.getElementById("email-group");
const passwordGroup = document.getElementById("password-group");
const fullnameGroup = document.getElementById("fullname-group");
const usernameGroup = document.getElementById("username-group");
const newPasswordGroup = document.getElementById("new-password-group");
const confirmPasswordGroup = document.getElementById("confirm-password-group");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const fullnameInput = document.getElementById("fullname");
const usernameInput = document.getElementById("username");
const newPasswordInput = document.getElementById("new-password");
const confirmPasswordInput = document.getElementById("confirm-password");

const submitBtn = document.getElementById("submit-btn");
const backBtn = document.getElementById("back-btn");
const loading = document.getElementById("loading");
const formTitle = document.getElementById("form-title");
const formSubtitle = document.getElementById("form-subtitle");

let currentStep = "email"; // email, login, signup

// Hide all groups
function hideAllGroups() {
  document.querySelectorAll(".form-group").forEach((group) => {
    group.classList.remove("active");
  });
}

// Show error
function showError(inputId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(`${inputId}-error`);
  input.classList.add("error");
  error.textContent = message;
  error.classList.add("active");
}

// Clear errors
function clearErrors() {
  document.querySelectorAll("input").forEach((input) => {
    input.classList.remove("error");
  });
  document.querySelectorAll(".error-message").forEach((error) => {
    error.classList.remove("active");
  });
}

// Reset to email step
function resetToEmail() {
  currentStep = "email";
  hideAllGroups();
  clearErrors();
  emailGroup.classList.add("active");
  submitBtn.textContent = "Continue";
  backBtn.style.display = "none";
  formTitle.textContent = "Welcome";
  formSubtitle.textContent = "Enter your email to continue";
  passwordInput.value = "";
  fullnameInput.value = "";
  newPasswordInput.value = "";
  confirmPasswordInput.value = "";
}

// Check email
async function checkEmail(email) {
  try {
    loading.classList.add("active");
    submitBtn.disabled = true;

    const response = await axios.post("/auth/check-email", { email });

    if (response.data.action === "login required") {
      currentStep = "login";
      hideAllGroups();
      passwordGroup.classList.add("active");
      submitBtn.textContent = "Login";
      backBtn.style.display = "block";
      formTitle.textContent = "Welcome Back!";
      formSubtitle.textContent = "Enter your password to continue";
    } else if (response.data.action === "signup required") {
      currentStep = "signup";
      hideAllGroups();
      fullnameGroup.classList.add("active");
      usernameGroup.classList.add("active");
      newPasswordGroup.classList.add("active");
      confirmPasswordGroup.classList.add("active");
      submitBtn.textContent = "Sign Up";
      backBtn.style.display = "block";
      formTitle.textContent = "Create Account";
      formSubtitle.textContent = "Complete your registration";
    }
  } catch (error) {
    showError(
      "email",
      error.response?.data?.message || "Failed to check email"
    );
  } finally {
    loading.classList.remove("active");
    submitBtn.disabled = false;
  }
}

// Login
async function login(email, password) {
  try {
    loading.classList.add("active");
    submitBtn.disabled = true;

    const response = await axios.post("/auth/login", { email, password });

    if (response.data.status === "success") {
      window.location.href = response.data.redirect || "/";
    }
  } catch (error) {
    showError("password", error.response?.data?.message || "Invalid password");
  } finally {
    loading.classList.remove("active");
    submitBtn.disabled = false;
  }
}

// Register
async function register(email, username, fullname, password, confirmPassword) {
  // Validation
  if (password !== confirmPassword) {
    showError("confirm-password", "Passwords do not match");
    return;
  }

  if (password.length < 6) {
    showError("new-password", "Password must be at least 6 characters");
    return;
  }

  try {
    loading.classList.add("active");
    submitBtn.disabled = true;

    const response = await axios.post("/auth/register", {
      email,
      username,
      fullname,
      password,
      confirmPassword,
    });

    if (response.data.status === "success") {
      window.location.href = response.data.redirect || "/";
    }
  } catch (error) {
    const message = error.response?.data?.message || "Registration failed";
    showError("new-password", message);
  } finally {
    loading.classList.remove("active");
    submitBtn.disabled = false;
  }
}

// Form submit handler
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearErrors();

  if (currentStep === "email") {
    const email = emailInput.value.trim();
    if (!email) {
      showError("email", "Email is required");
      return;
    }
    await checkEmail(email);
  } else if (currentStep === "login") {
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    if (!password) {
      showError("password", "Password is required");
      return;
    }
    await login(email, password);
  } else if (currentStep === "signup") {
    const email = emailInput.value.trim();
    const fullname = fullnameInput.value.trim();
    const username = usernameInput.value.trim();
    const password = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!fullname) {
      showError("fullname", "Full name is required");
      return;
    }
    if (!password) {
      showError("new-password", "Password is required");
      return;
    }
    if (!confirmPassword) {
      showError("confirm-password", "Please confirm your password");
      return;
    }

    await register(email, username, fullname, password, confirmPassword);
  }
});

// Back button handler
backBtn.addEventListener("click", resetToEmail);