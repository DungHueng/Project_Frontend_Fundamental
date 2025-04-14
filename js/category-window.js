let lessons = JSON.parse(localStorage.getItem("lessons")) || [];
const currentSubjectId = "subject";
let editLessonId = null; // Biến để lưu ID bài học đang được chỉnh sửa
let sortByNameAsc = true; // true: A-Z, false: Z-A

const Lessons = [
  {
    id: 1,
    subject_id: "subject",
    lesson_name: "Session 01 - Tổng quan về HTML",
    time: "45",
    status: "done",
    created_at: "2025-04-10T10:00:00Z"
  },
  {
    id: 2,
    subject_id: "subject",
    lesson_name: "Session 02 - Thẻ Inline và Block",
    time: "60",
    status: "notdone",
    created_at: "2025-04-11T08:00:00Z"
  },
  {
    id: 3,
    subject_id: "subject",
    lesson_name: "Session 03 - Form và Table",
    time: "40",
    status: "done",
    created_at: "2025-04-09T14:00:00Z"
  },
  {
    id: 4,
    subject_id: "subject",
    lesson_name: "Session 04 - CSS cơ bản",
    time: "45",
    status: "done",
    created_at: "2025-04-10T10:00:00Z"
  },
  {
    id: 5,
    subject_id: "subject",
    lesson_name: "Session 05  - CSS layout",
    time: "60",
    status: "notdone",
    created_at: "2025-04-11T08:00:00Z"
  },
  {
    id: 6,
    subject_id: "subject",
    lesson_name: "Session 06 - CSS Flex box",
    time: "45",
    status: "done",
    created_at: "2025-04-09T14:00:00Z"
  },
  {
    id: 7,
    subject_id: "subject",
    lesson_name: "Session 12 - Con trỏ trong C",
    time: "45",
    status: "notdone",
    created_at: "2025-04-11T08:00:00Z"
  },
  {
    id: 8,
    subject_id: "subject",
    lesson_name: "Session 15 - Đọc và ghi file",
    time: "60",
    status: "done",
    created_at: "2025-04-09T14:00:00Z"
  }
];

// Lưu vào localStorage
localStorage.setItem("lessons", JSON.stringify(Lessons));

function saveLesson() {
  const nameInput = document.getElementById("lessonName");
  const subjectInput = document.getElementById("lessonSubject");
  const timeInput = document.getElementById("lessonTime");
  const statusInput = document.querySelector('input[name="lessonStatus"]:checked');

  const name = nameInput.value.trim();
  const subject = subjectInput.value.trim();
  const time = timeInput.value.trim();

  document.getElementById("nameError").textContent = "";
  document.getElementById("subjectError").textContent = "";
  document.getElementById("timeError").textContent = "";
  document.getElementById("statusError").textContent = "";

  let hasError = false;

  if (!name) {
    document.getElementById("nameError").textContent = "Vui lòng nhập tên bài học.";
    hasError = true;
  }

  if (!subject) {
    document.getElementById("subjectError").textContent = "Vui lòng chọn môn học.";
    hasError = true;
  }

  if (!time) {
    document.getElementById("timeError").textContent = "Vui lòng nhập thời gian.";
    hasError = true;
  }

  if (!statusInput) {
    document.getElementById("statusError").textContent = "Vui lòng chọn trạng thái.";
    hasError = true;
  }

  if (lessons.some(lesson => lesson.lesson_name.trim().toLowerCase() === name.toLowerCase() && lesson.id !== editLessonId)) {
    document.getElementById("nameError").textContent = "Tên bài học đã tồn tại.";
    hasError = true;
  }

  if (hasError) return;

  const status = statusInput.value;
  const id = editLessonId || Date.now();
  const createdAt = editLessonId ? lessons.find(l => l.id === id).created_at : new Date().toISOString();

  const newLesson = {
    id,
    subject_id: currentSubjectId,
    lesson_name: name,
    time,
    status,
    created_at: createdAt
  };

  if (editLessonId) {
    lessons = lessons.map(lesson => lesson.id === id ? newLesson : lesson); // sẽ duyệt qua từng phần tử trong mảng lessons, và trả về một mảng mới.
    editLessonId = null;
  } else {
    lessons.unshift(newLesson);
  }

  localStorage.setItem("lessons", JSON.stringify(lessons));

  nameInput.value = "";
  subjectInput.value = "";
  timeInput.value = "";
  statusInput.checked = false;

  hide();
  renderLessons();

  Swal.fire({
    icon: 'success',
    title: editLessonId ? 'Cập nhật thành công!' : 'Thêm thành công!',
    text: editLessonId ? 'Bài học đã được cập nhật.' : 'Bài học đã được thêm vào danh sách.',
    timer: 1500,
    showConfirmButton: false
  });
}

function openEditModal(id) {
  const lesson = lessons.find(l => l.id === id);
  if (lesson) {
    const nameInput = document.getElementById("lessonName");
    const subjectInput = document.getElementById("lessonSubject");
    const timeInput = document.getElementById("lessonTime");
    const statusInput = document.querySelector(`input[name="lessonStatus"][value="${lesson.status}"]`);

    nameInput.value = lesson.lesson_name;
    subjectInput.value = lesson.subject_id;
    timeInput.value = lesson.time;
    statusInput.checked = true;

    editLessonId = id;
    show();
  }
}

function openDeleteModal(id) {
  Swal.fire({
    title: 'Bạn có chắc muốn xoá bài học này?',
    text: 'Thao tác này không thể hoàn tác!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Xoá',
    cancelButtonText: 'Hủy'
  }).then((result) => {
    if (result.isConfirmed) {
      lessons = lessons.filter(l => l.id !== id); // Xóa bài học theo ID
      localStorage.setItem("lessons", JSON.stringify(lessons));
      renderLessons(); // Cập nhật danh sách
      Swal.fire({
        icon: 'success',
        title: 'Đã xoá!',
        text: 'Bài học đã bị xoá.',
        timer: 1200,
        showConfirmButton: false
      });
    }
  });
}

function show() {
  document.getElementById("board_main").style.display = "flex";
}

function hide() {
  document.getElementById("board_main").style.display = "none";
}

function closeBoard() {
  hide();
}

window.onload = function () {
  renderLessons();

  const sortIcon = document.getElementById("sortByNameBtn");
  if (sortIcon) {
    sortIcon.addEventListener("click", () => {
      sortByNameAsc = !sortByNameAsc; // Đổi thứ tự sắp xếp A-Z/Z-A
      renderLessons();
    });
  }
};

/* Phân trang */
let currentPage = 1;
const lessonsPerPage = 4;

function paginateLessons(data, itemsPerPage, page) {
  const start = (page - 1) * itemsPerPage;
  const end = page * itemsPerPage;
  return data.slice(start, end);
}

function renderLessons() {
  const tableBody = document.getElementById("lessonTableBody");
  tableBody.innerHTML = "";

  const searchTerm = document.getElementById("searchInput")?.value.toLowerCase() || "";
  const statusFilter = document.getElementById("statusFilter")?.value || "";

  let filteredLessons = lessons.filter(l => l.subject_id === currentSubjectId);

  if (searchTerm) {
    filteredLessons = filteredLessons.filter(l =>
      l.lesson_name.toLowerCase().includes(searchTerm)
    );
  }

  if (statusFilter) {
    filteredLessons = filteredLessons.filter(l => {
      if (statusFilter === "done") return l.status === "done";
      if (statusFilter === "notdone") return l.status === "notdone";
      return true;
    });
  }
  

  // Sắp xếp theo tên (nếu có biến sortByNameAsc)
  filteredLessons.sort((a, b) => {
    return sortByNameAsc
      ? a.lesson_name.localeCompare(b.lesson_name)
      : b.lesson_name.localeCompare(a.lesson_name);
  });

  const totalPages = Math.ceil(filteredLessons.length / lessonsPerPage);
  if (currentPage > totalPages) currentPage = 1;

  const paginatedLessons = paginateLessons(filteredLessons, lessonsPerPage, currentPage);

  let str = "";
  paginatedLessons.forEach((lesson, i) => {
    const statusColor = lesson.status === "done"
      ? `style="background-color: #ECFDF3; color: #027A48;"`
      : `style="background-color: #FEF2F2; color: #B91C1C;"`;

    str += `
      <tr>
        <td><input type="checkbox"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${lesson.lesson_name}</td>
        <td>${lesson.time}</td>
        <td><button class="${lesson.status === "done" ? "online" : "offline"}" disabled ${statusColor}>${lesson.status === "done" ? "Đã hoàn thành" : "Chưa hoàn thành"}</button></td>
        <td>
          <i class="fas fa-trash" onclick="openDeleteModal(${lesson.id})"></i>
          &nbsp;&nbsp;&nbsp;
          <i class="fa-solid fa-pen" onclick="openEditModal(${lesson.id})"></i>
        </td>
      </tr>
    `;
  });

  tableBody.innerHTML = str;
  renderLessonPagination(filteredLessons.length);
}

function renderLessonPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / lessonsPerPage);
  let str = "";

  // Nút Prev
  str += `<button class="button" onclick="prevLessonPage()" ${currentPage === 1 ? 'disabled' : ''}>&lt;</button>`;

  // Nút số trang
  for (let i = 1; i <= totalPages; i++) {
    str += `<button class="button" onclick="goToLessonPage(${i})" ${
      i === currentPage
        ? 'style="font-weight:bold;background-color:#0066FF;color:white;"'
        : ""
    }>${i}</button>`;
  }

  // Nút Next
  str += `<button class="button" onclick="nextLessonPage()" ${currentPage === totalPages ? 'disabled' : ''}>&gt;</button>`;

  document.getElementById("paginationContainer").innerHTML = str;
}

function prevLessonPage() {
  if (currentPage > 1) {
    currentPage--;
    renderLessons();
  }
}

function nextLessonPage() {
  currentPage++;
  renderLessons();
}

function goToLessonPage(page) {
  currentPage = page;
  renderLessons();
}


  // Áp dụng sắp xếp theo tên
   filteredLessons.sort((a, b) => {
    return sortByNameAsc
      ? a.lesson_name.localeCompare(b.lesson_name)
      : b.lesson_name.localeCompare(a.lesson_name);
  });

  const { start, end } = calculateStartEnd();
  const paginatedLessons = filteredLessons.slice(start, end);

  paginatedLessons.forEach(lesson => {
    const statusClass = lesson.status === "done" ? "online" : "offline";
    const statusText = lesson.status === "done" ? "Đã hoàn thành" : "Chưa hoàn thành";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input type="checkbox"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${lesson.lesson_name}</td>
      <td>${lesson.time}</td>
      <td><span class="${statusClass}">${statusText}</span></td>
      <td>
       <i class="fas fa-trash" onclick="openDeleteModal(${lesson.id})"></i>
        &nbsp;&nbsp;&nbsp;
       <i class="fa-solid fa-pen" onclick="openEditModal(${lesson.id})"></i>
      </td>
    `;
    tableBody.appendChild(row);
  });

  renderPagination(filteredLessons.length);


function renderPagination(totalLessons) {
  const paginationContainer = document.getElementById("paginationContainer");
  if (!paginationContainer) return;

  const totalPages = Math.ceil(totalLessons / lessonsPerPage);
  if (totalLessons === 0) {
    paginationContainer.innerHTML = "<p>No lessons available.</p>";
    return;
  }
  let paginationHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    paginationHTML += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
  }

  paginationContainer.innerHTML = `
    <button class="page-btn" ${currentPage === 1 ? "disabled" : ""} onclick="changePage(${currentPage - 1})">&larr;</button>
    ${paginationHTML}
    <button class="page-btn" ${currentPage === totalPages ? "disabled" : ""} onclick="changePage(${currentPage + 1})">&rarr;</button>
  `;
}

function changePage(page) {
  currentPage = page;
  renderLessons();
}