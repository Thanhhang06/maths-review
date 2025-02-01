// Firebase Config (Chỉ khai báo MỘT LẦN)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Kiểm tra nếu Firebase chưa khởi tạo thì mới khởi tạo
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Định nghĩa `auth` và `db`
const auth = firebase.auth();
const db = firebase.firestore();

// Hàm đăng ký tài khoản
function signup() {
    let email = document.getElementById("signup-email").value;
    let password = document.getElementById("signup-password").value;

    console.log("🔹 Trying to Sign Up:", email);

    // Kiểm tra nếu Firebase đã khởi tạo
    if (!firebase.apps.length) {
        console.error("❌ Firebase has not been initialized!");
        alert("Firebase chưa được khởi tạo!");
        return;
    }

    // Kiểm tra nếu `auth` chưa được định nghĩa
    if (!auth) {
        console.error("❌ 'auth' is not defined yet!");
        alert("Hệ thống chưa sẵn sàng! Vui lòng tải lại trang.");
        return;
    }

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            let user = userCredential.user;
            console.log("✅ User Created:", user);

            // Gửi email xác thực
            return user.sendEmailVerification();
        })
        .then(() => {
            console.log("📩 Verification email sent!");
            alert("Verification email sent! Please check your inbox.");

            // Lưu tài khoản vào Firestore
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
