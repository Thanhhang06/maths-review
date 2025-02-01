function showSignup() {
    document.querySelector('.login-container').style.display = 'none';
    document.querySelector('.signup-container').style.display = 'block';
}

function showLogin() {
    document.querySelector('.signup-container').style.display = 'none';
    document.querySelector('.login-container').style.display = 'block';
}

function signup() {
    let newUsername = document.getElementById("new-username").value;
    let newPassword = document.getElementById("new-password").value;

    if (newUsername.trim() === "" || newPassword.trim() === "") {
        alert("Please fill in all fields.");
        return;
    }

    // Lưu tài khoản vào localStorage
    localStorage.setItem("username", newUsername);
    localStorage.setItem("password", newPassword);
    
    alert("Sign up successful! You can now log in.");
    showLogin();
}

function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let savedUsername = localStorage.getItem("username");
    let savedPassword = localStorage.getItem("password");

    if (username === savedUsername && password === savedPassword) {
        alert("Login successful!");
        window.location.href = "home.html";
    } else {
        alert("Invalid username or password. Try again!");
    }
}
