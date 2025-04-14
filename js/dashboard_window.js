let localLessons = JSON.parse(localStorage.getItem("lessons")) || [];

//  POPUP THÊM MÔN HỌC 
function show() {
  document.getElementById("board_main").style.display = "flex";
}
function hide() {
  document.getElementById("board_main").style.display = "none";
}
function closeBoard() {
  hide();
}

// XÁC NHẬN ĐĂNG XUẤT 
function confirmLogout() {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger"
    },
    buttonsStyling: false
  });

  swalWithBootstrapButtons.fire({
    title: "Bạn có chắc muốn đăng xuất không?",
    text: "Sau khi đăng xuất, bạn sẽ phải đăng nhập lại.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Đăng xuất",
    cancelButtonText: "Hủy",
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem("isLoggedIn");
      swalWithBootstrapButtons.fire({
        title: "Đã đăng xuất",
        text: "Bạn đã đăng xuất thành công.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        window.location.href = "login.html";
      });
    } else {
      swalWithBootstrapButtons.fire({
        title: "Hủy bỏ",
        text: "Bạn đã huỷ đăng xuất thành công ^^!",
        icon: "success",
        timer: 1000,
        showConfirmButton: false
      });
    }
  });
}

// QUẢN LÝ MÔN HỌC 
let subjects = JSON.parse(localStorage.getItem("subjects")) || [];
let currentUpdateIndex = null;
let itemsPerPage = 4;
let currentPage = 1;
let isSorted = false;
let originalSubjects = [...subjects];

function addSubject() {
  let id = subjects.length === 0 ? 1 : subjects[subjects.length - 1].id + 1;
  let name = document.getElementById("subjectName").value.trim();
  let accept = document.querySelector('input[name="accept"]:checked')?.value;

  if (!name || !accept) {
    Swal.fire({
      icon: 'error',
      title: 'Thông tin không được để trống!',
      timer: 1500,
      showConfirmButton: false
    });
    return;
  }

  const duplicate = subjects.some(subject => subject.name.toLowerCase() === name.toLowerCase());
  if (duplicate) {
    Swal.fire({
      icon: 'error',
      title: 'Tên môn học đã tồn tại!',
      timer: 1500,
      showConfirmButton: false
    });
    return;
  }

  subjects.push({ id, name, accept });
  localStorage.setItem("subjects", JSON.stringify(subjects));
  originalSubjects = [...subjects];
  closeBoard();
  updatePagination();

  Swal.fire({
    icon: 'success',
    title: 'Đã thêm!',
    text: 'Môn học đã được thêm thành công.',
    timer: 1200,
    showConfirmButton: false
  });
}

function deleteSubject(index) {
  Swal.fire({
    title: 'Bạn có chắc muốn xoá môn học này?',
    text: 'Thao tác này không thể hoàn tác!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Xoá',
    cancelButtonText: 'Hủy'
  }).then((result) => {
    if (result.isConfirmed) {
      subjects.splice(index, 1);
      localStorage.setItem("subjects", JSON.stringify(subjects));
      originalSubjects = [...subjects];
      updatePagination();
      Swal.fire({
        icon: 'success',
        title: 'Đã xoá!',
        text: 'Môn học đã bị xoá.',
        timer: 1200,
        showConfirmButton: false
      });
    }
  });
}

function updateSubject(index) {
  const subject = subjects[index];
  currentUpdateIndex = index;

  document.getElementById("fixModal").style.display = "block";
  document.querySelector("#fixModal input.subjectName").value = subject.name;

  const radios = document.querySelectorAll('#fixModal input[name="accpect"]');
  radios.forEach(r => {
    r.checked = r.value === subject.accept;
  });
}

function confirmFix() {
  const name = document.querySelector('#fixModal input.subjectName').value.trim();
  const accept = document.querySelector('#fixModal input[name="accpect"]:checked')?.value;

  // Kiểm tra trống
  if (!name || !accept) {
    Swal.fire({
      icon: 'error',
      title: 'Thông tin không được để trống!',
      timer: 1500,
      showConfirmButton: false
    });
    return;
  }

  // Kiểm tra trùng tên (trừ chính bản thân)
  const isDuplicate = subjects.some((s, i) =>
    i !== currentUpdateIndex &&
    s.name.toLowerCase() === name.toLowerCase()
  );

  if (isDuplicate) {
    Swal.fire({
      icon: 'error',
      title: 'Tên môn học đã tồn tại!',
      timer: 1500,
      showConfirmButton: false
    });
    return;
  }

  // Nếu hợp lệ, cập nhật
  subjects[currentUpdateIndex].name = name;
  subjects[currentUpdateIndex].accept = accept;

  localStorage.setItem("subjects", JSON.stringify(subjects));
  originalSubjects = [...subjects];
  document.getElementById("fixModal").style.display = "none";
  updatePagination();

  Swal.fire({
    icon: 'success',
    title: 'Cập nhật thành công',
    timer: 1200,
    showConfirmButton: false
  });
}

function closeModal1() {
  document.getElementById("fixModal").style.display = "none";
}

//  PHÂN TRANG 
function getPages() {
  return Math.ceil(subjects.length / itemsPerPage);
}

function calStartEnd() {
  let start = (currentPage - 1) * itemsPerPage;
  let end = currentPage * itemsPerPage;
  return { start, end };
}

function showSubject() {
  let { start, end } = calStartEnd();
  let str = "";

  for (let i = start; i < end && i < subjects.length; i++) {
    let subject = subjects[i];
    let statusColor = subject.accept === "Đang hoạt động"
      ? `style="background-color: #ECFDF3; color: #027A48;"`
      : `style="background-color: #FEF2F2; color: #B91C1C;"`;

    str += `
      <tr class="color">
        <td>${subject.name}</td>
        <td><span class="active"><button class="${subject.accept === "Đang hoạt động" ? "online" : "offline"}" disabled ${statusColor}>${subject.accept}</button></span></td>
        <td> 
          <i class="fas fa-trash" onclick="deleteSubject(${i})"></i>
          &nbsp;&nbsp;&nbsp; 
          <i class="fa-solid fa-pen" onclick="updateSubject(${i})"></i>
        </td>
      </tr>
    `;
  }

  document.getElementById("SubjectTableBody").innerHTML = str;
  renderPagination();
}

function renderPagination() {
  let totalPages = getPages();
  let str = "";

  if (currentPage > 1) {
    str += `<button class="button" onclick="prevPage()">&lt;</button>`;
  }

  for (let i = 1; i <= totalPages; i++) {
    str += `<button class="button" onclick="gotoPage(${i})" ${i === currentPage ? 'style="font-weight:bold;background-color:#0066FF;color:white;"' : ''}>${i}</button>`;
  }

  if (currentPage < totalPages) {
    str += `<button class="button" onclick="nextPage()">&gt;</button>`;
  }

  document.getElementById("paginationContainer").innerHTML = str;
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    showSubject();
  }
}

function nextPage() {
  if (currentPage < getPages()) {
    currentPage++;
    showSubject();
  }
}

function gotoPage(page) {
  currentPage = page;
  showSubject();
}

function updatePagination() {
  showSubject();
  renderPagination();
}

//  TÌM KIẾM & LỌC 
function searchSubject() {
  let keyword = document.getElementById("search-0").value.trim().toLowerCase();
  let filtered = subjects.filter(s => s.name.toLowerCase().includes(keyword));
  renderSearch(filtered);
}

function filter() {
  let status = document.getElementById("subject").value.trim();
  let keyword = document.getElementById("search-0").value.trim().toLowerCase();
  let filtered = subjects.filter(s =>
    (status === "" || s.accept === status) &&
    s.name.toLowerCase().includes(keyword)
  );
  renderSearch(filtered);
}

function renderSearch(list) {
  let str = "";
  for (let i = 0; i < list.length; i++) {
    let subject = list[i];
    let statusColor = subject.accept === "Đang hoạt động"
      ? `style="background-color: #ECFDF3; color: #027A48;"`
      : `style="background-color: #FEF2F2; color: #B91C1C;"`;

    str += `
      <tr class="color">
        <td>${subject.name}</td>
        <td><span class="active"><button class="${subject.accept === "Đang hoạt động" ? "online" : "offline"}" disabled ${statusColor}>${subject.accept}</button></span></td>
        <td> 
          <i class="fas fa-trash" onclick="deleteSubject(${subjects.indexOf(subject)})"></i>
          &nbsp;&nbsp;&nbsp; 
          <i class="fa-solid fa-pen" onclick="updateSubject(${subjects.indexOf(subject)})"></i>
        </td>
      </tr>
    `;
  }

  document.getElementById("SubjectTableBody").innerHTML = str;
  document.getElementById("paginationContainer").innerHTML = ""; // Tắt phân trang
}

//  SẮP XẾP THEO TÊN 
function sortSubjectsByName() {
  isSorted = !isSorted;

  if (isSorted) {
    subjects.sort((a, b) => a.name.localeCompare(b.name));
    document.getElementById("paginationContainer").innerHTML = "";
    renderSortedSubjects();
  } else {
    subjects = [...originalSubjects];
    updatePagination();
  }
}

function renderSortedSubjects() {
  let str = "";
  for (let i = 0; i < subjects.length; i++) {
    let subject = subjects[i];
    let statusColor = subject.accept === "Đang hoạt động"
      ? `style="background-color: #ECFDF3; color: #027A48;"`
      : `style="background-color: #FEF2F2; color: #B91C1C;"`;

    str += `
      <tr class="color">
        <td>${subject.name}</td>
        <td><span class="active"><button class="${subject.accept === "Đang hoạt động" ? "online" : "offline"}" disabled ${statusColor}>${subject.accept}</button></span></td>
        <td> 
          <i class="fas fa-trash" onclick="deleteSubject(${i})"></i>
          &nbsp;&nbsp;&nbsp; 
          <i class="fa-solid fa-pen" onclick="updateSubject(${i})"></i>
        </td>
      </tr>
    `;
  }

  document.getElementById("SubjectTableBody").innerHTML = str;
}

/* Khi để trống thì hiện thông báo lỗi */
updatePagination();

/* Sắp xếp */
let isAscending = true;
function toggleSort() {
  isAscending = !isAscending;

  subjects.sort((a, b) => {
    return isAscending
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  });

  originalSubjects = [...subjects]; // cập nhật dữ liệu gốc
  currentPage = 1; // quay lại trang đầu tiên
  updatePagination(); // cập nhật hiển thị
}