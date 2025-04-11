/* Xác nhận đăng xuất */
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
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire({
          title: "Hủy bỏ",
          text: "Bạn đã huỷ đăng xuất thành công ^^!.",
          icon: "success",
          timer: 1000,
          showConfirmButton: false
        });
      }
    });
  }
