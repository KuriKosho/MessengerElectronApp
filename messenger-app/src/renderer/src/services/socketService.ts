import { Store } from '@reduxjs/toolkit'
import { addMessage } from '@renderer/stores/chatSlice'
import { setConnectionStatus } from '@renderer/stores/connectionSlice'
import { RootState } from '@renderer/stores/store'
import { apiUrl } from '@shared/constants'
import { io, Socket } from 'socket.io-client'

interface Message {
  id: string
  content: string
  sender: string
}

class SocketService {
  private socket: Socket | null = null
  private store: Store

  constructor(store: Store) {
    this.store = store
  }

  connect() {
    const state = this.store.getState() as RootState
    const token = state.user.currentUser?.token // Lấy token từ Redux

    if (!token) {
      console.error('User not authenticated')
      return
    }

    this.socket = io(apiUrl, {
      transports: ['websocket'],
      auth: { token }, // Gửi token để xác thực
      reconnection: true
    })

    this.socket.on('connect', () => {
      this.store.dispatch(setConnectionStatus('connected'))
      console.log('Socket connected')
    })

    this.socket.on('disconnect', () => {
      this.store.dispatch(setConnectionStatus('disconnected'))
      console.log('Socket disconnected')
    })

    this.socket.on('new_message', (message: Message) => {
      this.store.dispatch(addMessage(message))
    })

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
    })
  }

  sendMessage(message: Omit<Message, 'sender'>) {
    const state = this.store.getState() as RootState
    const username = state.user.currentUser?.username

    if (!this.socket) return

    this.socket.emit('send_message', { ...message, sender: username })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
    }
  }
}

export default SocketService
