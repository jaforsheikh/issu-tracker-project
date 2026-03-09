// const login_Form = document.getElementById("login_Form");
// const user_name = document.getElementById("user_name");
// const password = document.getElementById("password");
// const error_message = document.getElementById("error_message");

// if (login_Form) {
//   login_Form.addEventListener("submit", function (e) {
//     e.preventDefault();

//     const user = user_name.value.trim();
//     const pass = password.value.trim();

//     if (user === "admin" && pass === "admin123") {
//       localStorage.setItem("isLoggedIn", "true");
//       localStorage.setItem("username", user);
//       error_message.textContent = "";
//       window.location.href = "main.html";
//     } else {
//       error_message.textContent = "Invalid username or password";
//     }
//   });
// }
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
