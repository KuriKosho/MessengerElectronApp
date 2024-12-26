import axiosInstance from '@renderer/config/axiosConfig'
import { setUsers } from '@renderer/stores/listUsersSlice'
import { AppDispatch } from '@renderer/stores/store'

const listUsersPath = '/get-all-users'

class ListUsersService {
  async listUsers(dispatch: AppDispatch, userId: string) {
    try {
      const response = await axiosInstance.get(listUsersPath, { params: { userId } })
      dispatch(setUsers(response.data))
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch users:', error)
      throw error
    }
  }
}

export default new ListUsersService()
