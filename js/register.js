let users = JSON.parse(localStorage.getItem("users")) || [];

document.getElementById('btn-register').addEventListener('click', function (e) {
  e.preventDefault();

  const hoVaTenDem = document.querySelector('.first_Name_box');
  const ten = document.querySelector('.name_box');
  const email = document.querySelector('.email-type');
  const password = document.querySelector('.pass-type');
  const checkbox = document.getElementById("accept");

  // Xoá các thông báo lỗi cũ
  removeError(hoVaTenDem);
  removeError(ten);
  removeError(email);
  removeError(password);
  removeCheckboxError();

  let isValid = true;

  if (hoVaTenDem.value.trim() === '') {
    showError(hoVaTenDem, 'Họ và tên không được để trống');
    isValid = false;
  }

  if (ten.value.trim() === '') {
    showError(ten, 'Tên không được để trống');
    isValid = false;
  }

  if (email.value.trim() === '') {
    showError(email, 'Email không được để trống');
    isValid = false;
  } else if (email.value.includes("@") && (email.value.endsWith(".com") || email.value.endsWith(".vn"))) {
    document.getElementById("p").setAttribute("class", "p1");
  } else {
    document.getElementById("p").setAttribute("class", "p2");
    showError(email, 'Email không đúng định dạng!');
    isValid = false;
  }

  if (password.value.trim() === '') {
    showError(password, 'Mật khẩu không được để trống');
    isValid = false;
  } else if (password.value.length < 8) {
    showError(password, 'Mật khẩu phải có ít nhất 8 ký tự');
    isValid = false;
  }

  if (!checkbox.checked) {
    showCheckboxError('Bạn cần đồng ý với điều khoản trước khi đăng ký.');
    isValid = false;
  }

  if (isValid) {
    const user = {
      email: email.value.trim(),
      password: password.value.trim()
    };
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));

    Swal.fire({
      title: "Đăng ký thành công!",
      icon: "success",
      timer: 2000,
      showConfirmButton: false
    }).then(() => {
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1000);
    });
    /* let timerInterval;
    Swal.fire({
      icon: "success",
      title: "Đăng ký thành công!",
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const timer = Swal.getPopup().querySelector("b");
        timerInterval = setInterval(() => {
          timer.textContent = Math.ceil(Swal.getTimerLeft() / 1000);
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      }
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {

        window.location.href = "login.html";
      }
    }); */
  }
});

function showError(input, message) {
  input.classList.add('input-error');
  const error = document.createElement('div');
  error.className = 'error-message';
  error.innerText = message;
  input.parentElement.appendChild(error);
}

function removeError(input) {
  input.classList.remove('input-error');
  const oldError = input.parentElement.querySelector('.error-message');
  if (oldError) oldError.remove();
}

function showCheckboxError(message) {
  const checkbox = document.getElementById("accept");
  checkbox.classList.add('checkbox-error');
  let error = document.getElementById('checkbox-error');
  if (!error) {
    error = document.createElement('div');
    error.id = 'checkbox-error';
    error.className = 'error-message';
    checkbox.parentElement.appendChild(error);
  }
  error.innerText = message;
}

function removeCheckboxError() {
  const checkbox = document.getElementById("accept");
  checkbox.classList.remove('checkbox-error');
  const error = document.getElementById('checkbox-error');
  if (error) error.remove();
}