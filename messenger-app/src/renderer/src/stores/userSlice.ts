import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface User {
  id: string
  username: string
  email: string
  password: string
  online: boolean
}

export interface UserState {
  currentUser: User | null
  isLoggedIn: boolean
}

const initialState: UserState = {
  currentUser: null,
  isLoggedIn: false
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload
      state.isLoggedIn = true
    },
    logout: (state) => {
      state.currentUser = null
      state.isLoggedIn = false
    }
  }
})

export const { login, logout } = userSlice.actions
export default userSlice.reducer
