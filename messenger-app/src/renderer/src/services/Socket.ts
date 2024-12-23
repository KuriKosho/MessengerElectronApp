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
import { WEBSOCKET_URL } from '@renderer/utils'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client/dist/sockjs'

let client: Client

// Kết nối WebSocket
export const connectWebSocket = (
  onMessageReceived: (message) => void,
  userId: string,
  onSignalReceived: (signal) => void,
  onCallReceived: (call) => void,
  onCallOffer: (offer) => void,
  onCallAnswer: (answer) => void,
  onCallCandidate: (candidate) => void,
  onCallEnd: (end) => void,
  onCallReject: (reject) => void,
  onCallAccept: (accept) => void
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
    // ---------------VIDEO CALL---------------------
    client.subscribe('/topic/testServer', (message) => {
      console.log('Message from signaling server:', message)
    })
    // ------------------CALL------------------
    client.subscribe(`/user/${userId}/topic/call`, (call) => {
      console.log('Call from signaling server:', call)
      onCallReceived(call)
    })
    // ------------------CALL OFFER------------------
    client.subscribe(`/user/${userId}/topic/offer`, (offer) => {
      console.log('Offer from signaling server:', offer)
      onCallOffer(offer)
    })
    // ------------------CALL ANSWER------------------
    client.subscribe(`/user/${userId}/topic/answer`, (answer) => {
      console.log('Answer from signaling server:', answer)
      onCallAnswer(answer)
    })
    // ------------------CALL CANDIDATE------------------
    client.subscribe(`/user/${userId}/topic/candidate`, (candidate) => {
      console.log('Candidate from signaling server:', candidate)
      onCallCandidate(candidate)
    })
    // ------------------CALL END------------------
    client.subscribe(`/user/${userId}/topic/end`, (end) => {
      console.log('Call ended', end)
      onCallEnd(end)
    })
    // ------------------CALL REJECT------------------
    client.subscribe(`/user/${userId}/topic/reject`, (reject) => {
      console.log('Call rejected', reject)
      onCallReject(reject)
    })
    // ------------------CALL ACCEPT------------------
    client.subscribe(`/user/${userId}/topic/accept`, (accept) => {
      console.log('Call accepted', accept)
      onCallAccept(accept)
    })

    // Send
    // Send
    client.publish({
      destination: '/app/addUser',
      body: userId
    })
  }

  client.activate()
}
// Video call send action
export const sendVideoCall = (senderId: string, receiverId: string) => {
  client.publish({
    destination: '/app/call',
    body: JSON.stringify({ callFrom: senderId, callTo: receiverId })
  })
}
// Video call end action
export const sendVideoCallEnd = (senderId: string, receiverId: string) => {
  client.publish({
    destination: '/app/end',
    body: JSON.stringify({ fromUser: senderId, toUser: receiverId })
  })
}
// Video call reject action
export const sendVideoCallReject = (senderId: string, receiverId: string) => {
  client.publish({
    destination: '/app/reject',
    body: JSON.stringify({ fromUser: senderId, toUser: receiverId })
  })
}
// Video call accept action
export const sendVideoCallAccept = (senderId: string, receiverId: string) => {
  client.publish({
    destination: '/app/call/accept',
    body: JSON.stringify({ fromUser: senderId, toUser: receiverId })
  })
}
// Send candidate
export const sendCandidate = (fromUser: string, toUser: string, candidate) => {
  client.publish({
    destination: '/app/candidate',
    body: JSON.stringify({
      fromUser: fromUser,
      toUser: toUser,
      candidate: candidate
    })
  })
}
// Send offer
export const sendOffer = (fromUser: string, toUser: string, offer) => {
  client.publish({
    destination: '/app/offer',
    body: JSON.stringify({ fromUser: fromUser, toUser: toUser, offer: offer })
  })
}
// Send answer
export const sendAnswer = (fromUser: string, toUser: string, answer) => {
  client.publish({
    destination: '/app/answer',
    body: JSON.stringify({ fromUser: fromUser, toUser: toUser, answer: answer })
  })
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
