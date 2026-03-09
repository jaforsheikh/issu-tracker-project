const loginForm = document.getElementById("login_Form");
const userNameInput = document.getElementById("user_name");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("error_message");
const demoUser = {
  username: "admin",
  password: "admin123",
};
const handleLogin = (e) => {
  e.preventDefault();
  const username = userNameInput.value.trim();
  const password = passwordInput.value.trim();
  if (username === demoUser.username && password === demoUser.password) {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("username", username);
    errorMessage.textContent = "";
    window.location.href = "main.html";
    return;
  }
  errorMessage.textContent = "Invalid username or password";
};
if (loginForm) {
  loginForm.addEventListener("submit", handleLogin);
}
