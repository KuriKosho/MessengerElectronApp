import { useWebRTC } from '@renderer/hooks/useWebRTC'
import React, { useEffect, useRef } from 'react'

const VideoCall: React.FC<{ userId: string; receiverId: string }> = ({ userId, receiverId }) => {
  const { startCall, stopCall, remoteStream } = useWebRTC(userId)
  const localVideoRef = useRef<HTMLVideoElement | null>(null)
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream
    }
  }, [remoteStream])

  const startLocalStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    })
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream
    }
  }

  return (
    <div>
      <video ref={localVideoRef} autoPlay muted />
      <video ref={remoteVideoRef} autoPlay />
      <button onClick={startLocalStream}>Start Local Stream</button>
      <button onClick={() => startCall(receiverId)}>Start Call</button>
      <button onClick={stopCall}>Stop Call</button>
    </div>
  )
}

export default VideoCall
