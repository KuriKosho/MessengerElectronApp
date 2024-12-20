import { AppDispatch } from '@renderer/stores/store'
import { login, logout } from '@renderer/stores/userSlice'
import { apiUrl } from '@shared/constants'
import axios from 'axios'

class AuthService {
  private apiUrl: string

  constructor() {
    this.apiUrl = apiUrl + '/api' // Thay bằng URL của server
  }

  async login(username: string, password: string, dispatch: AppDispatch) {
    try {
      const response = await axios.post(`${this.apiUrl}/login`, { username, password })
      const user = response.data // Giả sử server trả về { id, username, token }
      dispatch(login(user))
      return user
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  logout(dispatch: AppDispatch) {
    dispatch(logout())
  }
}

export default new AuthService()
