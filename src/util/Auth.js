import axios from 'axios'
import { forceMessageModal } from 'Components/swal'

// const getCookie = (name) =>
//   document.cookie.split('; ').find((row) => row.startsWith(`${name}=`))?.split('=')[1]

const instance = axios.create({
  baseURL: API_HOST,
  withCredentials: true,
  // headers: { 'X-XSRF-TOKEN': `${getCookie('XSRF-TOKEN')}` },
})

instance.interceptors.request.use((request) => {
  request.headers.Authorization = `Bearer ${sessionStorage.getItem('mrd_access_token')}`
  // request.headers['X-XSRF-TOKEN'] = `${getCookie('XSRF-TOKEN')}`
  return request
})

instance.interceptors.response.use(
  (response) => {
    if (response.data && response.data.messageid === 'TOKEN_FAIL') {
      forceMessageModal('您的連線已逾時，請重新登入。')
      sessionStorage.clear()
      window.location.href = '/'
    }
    return response
  },
  (error) => Promise.reject(error)
)

export default instance
