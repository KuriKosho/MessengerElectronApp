import { io, Socket } from 'socket.io-client'

export class SignalingService {
  private socket: Socket | null = null
  private userId: string

  constructor(userId: string) {
    this.userId = userId
    this.socket = io('http://localhost:8080/signaling', {
      query: { userId }
    })

    this.socket.on('connect', () => {
      console.log('Connected to signaling server')
    })
  }

  public sendOffer = (receiverId: string, offer: RTCSessionDescriptionInit) => {
    if (!this.socket) return
    this.socket.emit('offer', {
      offer,
      from: this.userId,
      to: receiverId
    })
  }

  public sendAnswer = (receiverId: string, answer: RTCSessionDescriptionInit) => {
    if (!this.socket) return
    this.socket.emit('answer', {
      answer,
      from: this.userId,
      to: receiverId
    })
  }

  public sendIceCandidate = (receiverId: string, candidate: RTCIceCandidate) => {
    if (!this.socket) return
    this.socket.emit('ice-candidate', {
      candidate,
      from: this.userId,
      to: receiverId
    })
  }

  public onOffer = (callback: (offer: RTCSessionDescriptionInit, from: string) => void) => {
    this.socket?.on('offer', ({ offer, from }) => callback(offer, from))
  }

  public onAnswer = (callback: (answer: RTCSessionDescriptionInit) => void) => {
    this.socket?.on('answer', ({ answer }) => callback(answer))
  }

  public onIceCandidate = (callback: (candidate: RTCIceCandidate) => void) => {
    this.socket?.on('ice-candidate', ({ candidate }) => callback(candidate))
  }

  public disconnect = () => {
    this.socket?.disconnect()
  }
}
