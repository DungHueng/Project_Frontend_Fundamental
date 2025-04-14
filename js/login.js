let users = JSON.parse(localStorage.getItem("users")) || [];

document.getElementById('btn-login').addEventListener('click', function () {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Xóa lỗi cũ
    removeError(emailInput);
    removeError(passwordInput);

    let isValid = true;

     if (email === '') {
        showError(emailInput, '');
        isValid = false;
    }

    if (password === '' || email === '') {
        showError(passwordInput || emailInput , 'Email và mật khẩu không được để trống');
        isValid = false;
    }

    if (!isValid) return;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const foundUser = users.find(user => user.email === email && user.password === password);

    if (foundUser) {
        Swal.fire({
            icon: "success",
            title: "Đăng nhập thành công!",
            timer: 2000,
            showConfirmButton: false
        }).then(() => {
            window.location.href = "dashboard.html";
        });
    } else {
        Swal.fire({
            icon: "error",
            title: "Email hoặc mật khẩu chưa chính xác!"
        });
    }
});

function showError(input, message) {
    input.classList.add('input-error');
    const error = document.createElement('div');
    error.className = 'error-message';
    error.innerText = message;
    input.insertAdjacentElement('afterend', error);
}

function removeError(input) {
    input.classList.remove('input-error');
    const next = input.nextElementSibling;
    if (next && next.classList.contains('error-message')) {
        next.remove();
    }
}

function checkPassword() {
    const passwordField = document.getElementById("password");
    passwordField.type = passwordField.type === "password" ? "text" : "password";
}
