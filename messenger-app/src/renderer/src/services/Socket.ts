// import { Client } from '@stomp/stompjs'
// import SockJS from 'sockjs-client/dist/sockjs'
// // import messageService from './messageService'

// const WEBSOCKET_URL = 'http://localhost:8080/ws'
// let client: Client

// export const connectWebSocket = (onMessageReceived: (message) => void, user_id?: string) => {
//   if (!user_id) {
//     console.error('user_id is required')
//     return
//   }

//   client = new Client({
//     webSocketFactory: () => new SockJS(WEBSOCKET_URL),
//     reconnectDelay: 5000,
//     debug: (str) => console.log('[STOMP Debug]: ', str),
//     connectHeaders: {
//       user_id
//     }
//   })

//   client.onConnect = () => {
//     console.log('Connected to WebSocket')

//     // Subscribe to private messages
//     client.subscribe(`/user/${user_id}/queue/messages`, (message) => {
//       if (message.body) {
//         const chatMessage = JSON.parse(message.body)
//         console.log('chatMessage', chatMessage)
//         onMessageReceived(chatMessage)
//       }
//     })
//   }

//   client.activate()
// }

// export const sendMessage = async (senderId: string, receiverId: string, content: string) => {
//   if (!senderId || !client?.connected) {
//     console.error('Sender ID and connection are required')
//     return
//   }

//   const message = {
//     senderId,
//     receiverId,
//     content,
//     timestamp: new Date().toISOString()
//   }

//   client.publish({
//     destination: '/app/chat',
//     body: JSON.stringify(message)
//   })
// }

// export const disconnectWebSocket = () => {
//   if (client?.connected) {
//     client.deactivate()
//   }
// }

// // // Subscribe to a topic
// export const subscribeTopic = (destination: string, callback: (message) => void) => {
//   if (client.connected) {
//     client.subscribe(destination, callback)
//   } else {
//     console.error('STOMP client is not connected')
//   }
// }

// // // Send a message
// export const sendTopic = (destination: string, body) => {
//   if (client?.connected) {
//     client.publish({
//       destination,
//       body: JSON.stringify(body)
//     })
//   } else {
//     console.error('STOMP client is not connected')
//   }
// }
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client/dist/sockjs'

const WEBSOCKET_URL = 'http://localhost:8080/ws'
let client: Client

// Kết nối WebSocket
export const connectWebSocket = (
  onMessageReceived: (message) => void,
  userId: string,
  onSignalReceived: (signal) => void
) => {
  if (!userId) {
    console.error('user_id is required')
    return
  }

  client = new Client({
    webSocketFactory: () => new SockJS(WEBSOCKET_URL),
    reconnectDelay: 5000,
    debug: (str) => console.log('[STOMP Debug]: ', str),
    connectHeaders: {
      user_id: userId
    }
  })

  client.onConnect = () => {
    console.log('Connected to WebSocket')

    // Subscribe to private messages
    client.subscribe(`/user/${userId}/queue/messages`, (message) => {
      if (message.body) {
        const chatMessage = JSON.parse(message.body)
        console.log('chatMessage', chatMessage)
        onMessageReceived(chatMessage)
      }
    })

    // Subscribe to signaling
    client.subscribe(`/user/${userId}/queue/signaling`, (message) => {
      if (message.body) {
        const signal = JSON.parse(message.body)
        console.log('Received signal:', signal)
        onSignalReceived(signal)
      }
    })
  }

  client.activate()
}

// Gửi thông báo signaling (offer/answer/candidate)
export const sendSignal = (
  name: string,
  senderId: string,
  receiverId: string,
  signalType: 'offer' | 'answer' | 'candidate' | 'leave' | 'stop',
  data
) => {
  if (!senderId || !client?.connected) {
    console.error('Sender ID and connection are required')
    return
  }

  const signal = {
    name,
    senderId,
    receiverId,
    type: signalType,
    data,
    timestamp: new Date().toISOString()
  }

  client.publish({
    destination: `/user/${receiverId}/queue/signaling`,
    body: JSON.stringify(signal)
  })
}

// Ngắt kết nối WebSocket
export const disconnectWebSocket = () => {
  if (client?.connected) {
    client.deactivate()
  }
}

// Gửi tin nhắn chat
export const sendMessage = (senderId: string, receiverId: string, content: string) => {
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
}

// Đăng ký lắng nghe topic
export const subscribeTopic = (destination: string, callback: (message) => void) => {
  if (client?.connected) {
    client.subscribe(destination, (message) => {
      if (message.body) {
        const parsedMessage = JSON.parse(message.body)
        callback(parsedMessage)
      }
    })
  } else {
    console.error('STOMP client is not connected')
  }
}

// Gửi thông tin đến topic
export const sendTopic = (destination: string, body) => {
  if (client?.connected) {
    client.publish({
      destination,
      body: JSON.stringify(body)
    })
  } else {
    console.error('STOMP client is not connected')
  }
}
