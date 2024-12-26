import axiosInstance from '@renderer/config/axiosConfig'
import { AppDispatch } from '@renderer/stores/store'
import { login, logout } from '@renderer/stores/userSlice'

const loginPath = '/login'
const registerPath = '/register'
const logoutPath = '/logout'
class AuthService {
  async login(email: string, password: string, dispatch: AppDispatch) {
    try {
      const response = await axiosInstance.post(loginPath, { email, password })
      if (response.data && response.data.success) {
        const user = response.data.data
        dispatch(login(user))
        return user
      } else {
        throw new Error('Login failed')
      }
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  async register(
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
    dispatch: AppDispatch
  ) {
    try {
      const response = await axiosInstance.post(registerPath, {
        username,
        email,
        password,
        confirmPassword
      })
      if (response.data && response.data.success) {
        const user = response.data.data
        dispatch(login(user))

        return user
      } else {
        throw new Error('Register failed')
      }
    } catch (error) {
      console.error('Register failed:', error)
      throw error
    }
  }

  async logout(email: string, dispatch: AppDispatch) {
    try {
      const response = await axiosInstance.post(logoutPath, { email })
      if (response.data && response.data.success) {
        dispatch(logout())
        return response.data
      } else {
        throw new Error('Logout failed')
      }
    } catch (error) {
      console.error('Logout failed:', error)
      throw error
    }
  }
}

export default new AuthService()
