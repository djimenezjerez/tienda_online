import axios from 'axios'

const app = JSON.parse(localStorage.getItem('app'))

let axiosInstance = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_APP_URL,
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Authorization': `Bearer ${app && app.token}`,
  },
})

axiosInstance.interceptors.response.use(function (res) {
  return res.data
}, function (error) {
  return Promise.reject(error);
});

export default axiosInstance
