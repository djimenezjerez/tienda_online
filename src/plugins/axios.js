import axios from 'axios'

const app = JSON.parse(localStorage.getItem('app'))

let axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_URL,
  // withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json; charset=UTF-8',
    'Authorization': `Bearer ${app && app.token}`,
  },
})

axiosInstance.interceptors.response.use(function (res) {
  return res.data
}, function (error) {
  return Promise.reject(error);
});

export default axiosInstance
