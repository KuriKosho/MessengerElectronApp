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

  async verifyOTP(email: string, otp: string) {
    try {
      const response = await axiosInstance.post('/verify', { email: email, code: otp })
      if (response.data && response.data.success) {
        return response.data
      } else {
        throw new Error('OTP verification failed')
      }
    } catch (error) {
      console.error('OTP verification failed:', error)
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
interface ProfileData {
  username: string
  email: string
  password?: string
  isOnline: boolean
  isVerified: boolean
}

export async function updateProfile(formData: FormData) {
  const data: ProfileData = {
    username: formData.get('username') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    isOnline: formData.get('isOnline') === 'true',
    isVerified: formData.get('isVerified') === 'true'
  }

  // Basic validation
  if (!data.username || data.username.length < 3 || data.username.length > 50) {
    return { error: 'Username must be between 3 and 50 characters.' }
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return { error: 'Please enter a valid email address.' }
  }

  if (data.password && data.password.length < 8) {
    return { error: 'Password must be at least 8 characters long.' }
  }

  // Here you would typically update the user profile in your database
  // For this example, we'll just return a success message
  return { success: 'Profile updated successfully!' }
}
