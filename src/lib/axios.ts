import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_API_URL

export const api = axios.create({
  baseURL,
})

api.interceptors.request.use(config => {
  const socketId = window.Echo.socketId()
  if (socketId) {
      config.headers['X-Socket-ID'] = socketId
  }
  return config
}, error => {
  return Promise.reject(error)
})
