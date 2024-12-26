import { configureStore } from '@reduxjs/toolkit'
import chatReducer from './chatSlice'
import connectionReducer from './connectionSlice'
import listUsersReducer from './listUsersSlice'
import userReducer from './userSlice'
const store = configureStore({
  reducer: {
    chat: chatReducer,
    connection: connectionReducer,
    user: userReducer,
    listUsers: listUsersReducer
  }
})

// Define RootState and AppDispatch for use with TypeScript
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
