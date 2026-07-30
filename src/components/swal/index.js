import Swal from 'sweetalert2'

export const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-primary mx-1',
    cancelButton: 'btn btn-outline-secondary mx-1',
  },
  buttonsStyling: false,
})

export const forceMessageModal = (text) =>
  swalWithBootstrapButtons.fire({
    text,
    icon: 'warning',
    confirmButtonText: '確定',
    allowOutsideClick: false,
    allowEscapeKey: false,
  })

export const confirmModal = (text, { confirmButtonText = '確定', cancelButtonText = '取消' } = {}) =>
  swalWithBootstrapButtons.fire({
    text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
  })

export const successModal = (text) =>
  swalWithBootstrapButtons.fire({ text, icon: 'success', confirmButtonText: '確定' })

export default swalWithBootstrapButtons
