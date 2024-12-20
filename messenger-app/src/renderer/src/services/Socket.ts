import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null
let socketId: string | null = null
const API_URL = 'http://localhost:3003'
export const connectWithSocketIOServer = (): void => {
  socket = io(API_URL)

  const eventHandlers: { event: string; handler: (...args) => void }[] = [
    { event: 'connect', handler: handleConnect },
    { event: 'online-users', handler: handleOnlineUsers },
    { event: 'chat-message', handler: handleChatMessage },
    { event: 'chat-rooms', handler: handleChatRooms },
    { event: 'user-disconnected', handler: handleUserDisconnect },
    { event: 'file-message', handler: handleFileMessage },
    { event: 'login-response', handler: handleLoginResponse }
  ]

  eventHandlers.forEach(({ event, handler }) => {
    socket?.on(event, handler)
  })
}

const handleConnect = (): void => {
  console.log('Connected to socket server')
  socketId = socket?.id || null
}

const handleOnlineUsers = (usersData): void => {
  console.log('Online users:', usersData)
}
const handleChatMessage = (data): void => {
  console.log('Chat message received:', data)
  // chatMessageHandler(data);
}

const handleChatRooms = (chatRooms): void => {
  console.log('Chat rooms:', chatRooms)
  // chatRoomsListHandler(chatRooms);
}

const handleFileMessage = (data): void => {
  console.log('File message received:', data)
  // chatMessageHandler(data);
}

const handleUserDisconnect = (): void => {
  console.log('User disconnected')
  // userDisconnectedHandler();
}

const handleLoginResponse = (response): void => {
  console.log('Login response:', response)
  if (response.success) {
    console.log('Login successful')
  } else {
    console.error('Login failed:', response.message)
  }
}

export const getSocketId = (): string | null => socketId

const emitEvent = (event: string, data): void => {
  socket?.emit(event, data)
}

export const login = (data): void => {
  emitEvent('user-login', data)
}

export const sendChatMessage = (data): void => emitEvent('chat-message', data)
export const sendFileMessage = (data): void => emitEvent('file-message', data)
export const createChatRoom = (data): void => emitEvent('chat-room-create', data)
