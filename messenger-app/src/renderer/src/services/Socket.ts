import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client/dist/sockjs'
// import messageService from './messageService'

const WEBSOCKET_URL = 'http://localhost:8080/ws'
let client: Client

export const connectWebSocket = (onMessageReceived: (message) => void, user_id?: string) => {
  if (!user_id) {
    console.error('user_id is required')
    return
  }

  client = new Client({
    webSocketFactory: () => new SockJS(WEBSOCKET_URL),
    reconnectDelay: 5000,
    debug: (str) => console.log('[STOMP Debug]: ', str),
    connectHeaders: {
      user_id
    }
  })

  client.onConnect = () => {
    console.log('Connected to WebSocket')

    // Subscribe to private messages
    client.subscribe(`/user/${user_id}/queue/messages`, (message) => {
      if (message.body) {
        const chatMessage = JSON.parse(message.body)
        console.log('chatMessage', chatMessage)
        onMessageReceived(chatMessage)
      }
    })

    // Subscribe to public chat room
    client.subscribe('/topic/public', (message) => {
      if (message.body) {
        const chatMessage = JSON.parse(message.body)
        onMessageReceived(chatMessage)
      }
    })
  }

  client.activate()
}

export const sendMessage = async (senderId: string, receiverId: string, content: string) => {
  if (!senderId || !client?.connected) {
    console.error('Sender ID and connection are required')
    return
  }

  const message = {
    senderId,
    receiverId,
    content,
    timestamp: new Date().toISOString()
  }

  client.publish({
    destination: '/app/chat',
    body: JSON.stringify(message)
  })

  // Also save to backend
  // await messageService.sendMessage(senderId, receiverId, content)
}

export const disconnectWebSocket = () => {
  if (client?.connected) {
    client.deactivate()
  }
}
