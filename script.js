// Cấu hình Firebase
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Khởi tạo Firebase nếu chưa khởi tạo
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

// Đợi trang load xong rồi mới gán sự kiện
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("signup-btn").addEventListener("click", signup);
    document.getElementById("toggle-signup").addEventListener("click", toggleForm);
    document.getElementById("toggle-login").addEventListener("click", toggleForm);
});

// Hàm đăng ký tài khoản
function signup() {
    let email = document.getElementById("signup-email").value;
    let password = document.getElementById("signup-password").value;

    console.log("🔹 Trying to Sign Up:", email);

    if (!auth) {
        console.error("❌ Firebase Authentication chưa được khởi tạo!");
        alert("Lỗi hệ thống! Vui lòng tải lại trang.");
        return;
    }

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            let user = userCredential.user;
            console.log("✅ User Created:", user);

            return user.sendEmailVerification();
        })
        .then(() => {
            console.log("📩 Verification email sent!");
            alert("Verification email sent! Please check your inbox.");

            return db.collection("users").doc(auth.currentUser.uid).set({
                email: email,
                approved: false,
                verified: false
            });
        })
        .then(() => {
            console.log("✅ User added to Firestore");
            alert("Signup successful! Wait for admin approval.");
            auth.signOut();
            toggleForm();
        })
        .catch((error) => {
            console.error("❌ Signup Error:", error.message);
            alert("Signup Failed: " + error.message);
        });
}

// Hàm chuyển đổi giữa đăng nhập và đăng ký
function toggleForm() {
    document.querySelector(".login-box").classList.toggle("hidden");
    document.querySelector(".signup-box").classList.toggle("hidden");
}
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("resources-btn").addEventListener("click", function() {
        window.location.href = "resources.html";
    });
});
