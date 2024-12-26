import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface User {
  id: string
  username: string
  email: string
  online: boolean
  avatar?: string
  lastSeen?: string
  timeStamp?: string
  lastMessage?: string
}

export interface ListUsersState {
  users: User[]
  loading: boolean
  error: string | null
}

export const initialState: ListUsersState = {
  users: [],
  loading: false,
  error: null
}

const listUsersSlice = createSlice({
  name: 'listUsers',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload
      state.loading = false
      state.error = null
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.loading = false
    },
    updateUserStatus: (state, action: PayloadAction<{ userId: string; isOnline: boolean }>) => {
      const user = state.users.find((u) => u.id === action.payload.userId)
      if (user) {
        user.online = action.payload.isOnline
        user.lastSeen = action.payload.isOnline ? undefined : new Date().toISOString()
      }
    },
    addUser: (state, action: PayloadAction<User>) => {
      if (!state.users.find((u) => u.id === action.payload.id)) {
        state.users.push(action.payload)
      }
    },
    removeUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((user) => user.id !== action.payload)
    }
  }
})

export const { setUsers, setLoading, setError, updateUserStatus, addUser, removeUser } =
  listUsersSlice.actions

export default listUsersSlice.reducer
