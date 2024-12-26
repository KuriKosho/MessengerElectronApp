import { useEffect, useRef, useState } from 'react'
import { connectWebSocket, disconnectWebSocket, sendSignal } from '../services/Socket'

export const useWebRTC = (userId: string) => {
  const peerConnection = useRef<RTCPeerConnection | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)

  useEffect(() => {
    connectWebSocket(handleSignalingMessage, userId)

    return () => {
      disconnectWebSocket()
    }
  }, [userId])

  const handleSignalingMessage = async (message) => {
    const { type, data } = message

    switch (type) {
      case 'offer': {
        await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(data.sdp))
        const answer = await peerConnection.current?.createAnswer()
        await peerConnection.current?.setLocalDescription(answer!)
        sendSignal(userId, message.senderId, 'answer', {
          sdp: answer?.sdp
        })
        break
      }

      case 'answer':
        await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(data.sdp))
        break

      case 'candidate':
        await peerConnection.current?.addIceCandidate(new RTCIceCandidate(data.candidate))
        break

      default:
        console.error('Unknown signaling message type:', type)
    }
  }

  const startCall = async (receiverId: string) => {
    peerConnection.current = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    })

    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    })

    localStream.getTracks().forEach((track) => {
      peerConnection.current?.addTrack(track, localStream)
    })

    peerConnection.current.onicecandidate = ({ candidate }) => {
      if (candidate) {
        sendSignal(userId, receiverId, 'candidate', { candidate })
      }
    }

    peerConnection.current.ontrack = (event) => {
      setRemoteStream(event.streams[0])
    }

    const offer = await peerConnection.current.createOffer()
    await peerConnection.current.setLocalDescription(offer)

    sendSignal(userId, receiverId, 'offer', { sdp: offer.sdp })
  }

  const stopCall = () => {
    peerConnection.current?.close()
    peerConnection.current = null
    setRemoteStream(null)
  }

  return { startCall, stopCall, remoteStream }
}
