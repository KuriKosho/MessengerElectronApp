import { refreshAccessToken } from '@renderer/services/spotify.service'
import tokenService from '@renderer/services/token.service'
import axios, { AxiosInstance, AxiosResponse } from 'axios'

export const appClient: AxiosInstance = axios.create({
  baseURL: 'https://api.spotify.com/v1/',
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json'
  }
})

appClient.interceptors.response.use(
  (response: AxiosResponse) => response, // Nếu request thành công
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refresh_token = 'STORED_REFRESH_TOKEN' // Lấy refresh_token đã lưu
      const newAccessToken = await refreshAccessToken(refresh_token)
      tokenService.setAccessToken(newAccessToken.accessToken, newAccessToken.expiresIn) // Cập nhật header với token mới
      originalRequest.headers.Authorization = 'Bearer ' + newAccessToken
      return appClient(originalRequest) // Thử lại request
    }

    return Promise.reject(error)
  }
)
