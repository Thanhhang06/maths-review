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

// Hiển thị danh sách người dùng chưa được phê duyệt
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

// Phê duyệt tài khoản
function approveUser(userId) {
    db.collection("users").doc(userId).update({ approved: true }).then(() => {
        alert("User approved successfully!");
        loadUsers(); // Cập nhật lại danh sách
    });
}

// Đăng xuất Admin
function logout() {
    auth.signOut().then(() => {
        window.location.href = "index.html";
    });
}

// Kiểm tra nếu là admin, nếu không thì chặn truy cập
auth.onAuthStateChanged((user) => {
    if (user) {
        db.collection("users").doc(user.uid).get().then((doc) => {
            if (doc.exists && doc.data().role === "admin") {
                loadUsers();
            } else {
                alert("You are not authorized to access this page.");
                window.location.href = "index.html";
            }
        });
    } else {
        window.location.href = "index.html";
    }
});
