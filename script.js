
// Firebase cấu hình (Chỉ khai báo MỘT lần, không lặp lại)
const firebaseConfig = {
  apiKey: "AIzaSyCUWgc1VPqgpNnIZKpYqFssdjZAB_QYUQk",
  authDomain: "maths-login.firebaseapp.com",
  projectId: "maths-login",
  storageBucket: "maths-login.firebasestorage.app",
  messagingSenderId: "547386894786",
  appId: "1:547386894786:web:74af1e2f9ff689fcbc4e5b",
  measurementId: "G-CJP6KPRRML"
};

// Kiểm tra Firebase đã được khởi tạo chưa
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();


// Chuyển đổi giữa đăng nhập và đăng ký
function toggleForm() {
    document.querySelector(".login-box").classList.toggle("hidden");
    document.querySelector(".signup-box").classList.toggle("hidden");
}

// Đăng ký tài khoản và xác thực email
function signup() {
    let email = document.getElementById("signup-email").value;
    let password = document.getElementById("signup-password").value;

    console.log("🔹 Trying to Sign Up:", email);

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            let user = userCredential.user;
            console.log("✅ User Created:", user);

            // Gửi email xác thực
            user.sendEmailVerification()
                .then(() => {
                    console.log("📩 Verification email sent!");
                    alert("Verification email sent! Please check your inbox.");
                });

            // Lưu tài khoản vào Firestore
            db.collection("users").doc(user.uid).set({
                email: email,
                approved: false,
                verified: false
            }).then(() => {
                console.log("✅ User added to Firestore");
                alert("Signup successful! Wait for admin approval.");
                auth.signOut();
                toggleForm();
            });
        })
        .catch((error) => {
            console.error("❌ Signup Error:", error.message);
            alert("Signup Failed: " + error.message);
        });
}


// Đăng nhập
function login() {
    let email = document.getElementById("login-email").value;
    let password = document.getElementById("login-password").value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            let user = userCredential.user;

            // Kiểm tra xác thực email
            if (!user.emailVerified) {
                alert("Please verify your email before logging in.");
                auth.signOut();
                return;
            }

            // Kiểm tra xem tài khoản đã được Admin phê duyệt chưa
            db.collection("users").doc(user.uid).get().then((doc) => {
                if (doc.exists && doc.data().approved) {
                    alert("Login successful!");
                    window.location.href = "home.html"; // Chuyển đến trang chính
                } else {
                    alert("Your account has not been approved yet.");
                    auth.signOut();
                }
            });
        })
        .catch((error) => {
            alert("Login Failed: " + error.message);
        });
}
