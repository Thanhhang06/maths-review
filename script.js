// Cấu hình Firebase
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Chuyển đổi giữa đăng nhập & đăng ký
function toggleForm() {
    document.querySelector(".login-box").classList.toggle("hidden");
    document.querySelector(".signup-box").classList.toggle("hidden");
}

// Đăng ký tài khoản và xác thực email
function signup() {
    let email = document.getElementById("signup-email").value;
    let password = document.getElementById("signup-password").value;

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            let user = userCredential.user;

            // Gửi email xác thực
            user.sendEmailVerification().then(() => {
                alert("Verification email sent! Please check your inbox.");
            });

            // Lưu tài khoản vào Firestore với trạng thái chưa được duyệt
            db.collection("users").doc(user.uid).set({
                email: email,
                approved: false,  // Chờ Admin phê duyệt
                verified: false   // Chờ xác thực email
            }).then(() => {
                alert("Signup successful! Wait for admin approval.");
                auth.signOut();
                toggleForm();
            });
        })
        .catch((error) => {
            alert(error.message);
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
            alert(error.message);
        });
}

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

function loadUsers() {
    db.collection("users").get().then((querySnapshot) => {
        let userList = document.getElementById("user-list");
        userList.innerHTML = "";

        querySnapshot.forEach((doc) => {
            let user = doc.data();
            let row = document.createElement("tr");

            row.innerHTML = `
                <td>${user.email}</td>
                <td>${user.approved ? "Approved" : "Pending"}</td>
                <td>
                    ${user.approved 
                        ? `<button disabled>Approved</button>` 
                        : `<button onclick="approveUser('${doc.id}')">Approve</button>`}
                </td>
            `;

            userList.appendChild(row);
        });
    });
}

function approveUser(userId) {
    db.collection("users").doc(userId).update({ approved: true }).then(() => {
        alert("User approved successfully!");
        loadUsers();
    });
}

window.onload = loadUsers;

console.log("Firebase Config Loaded:", firebaseConfig);
console.log("Firebase App Initialized:", firebase.apps.length > 0);

