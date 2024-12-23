import { API_URL } from '@renderer/utils'
import axios from 'axios'

// Create a new axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
  responseType: 'json'
})
// Add a response interceptor, if have data, set it to data
axiosInstance.interceptors.response.use((response) => {
  console.log('Response', response)
  return response
})

export default axiosInstance
