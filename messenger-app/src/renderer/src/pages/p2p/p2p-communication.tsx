'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Mic, MicOff, Send, Video, VideoOff } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import Peer from 'simple-peer'

interface Message {
  text: string
  sender: 'me' | 'peer'
}

export default function P2PCommunication() {
  const [peer, setPeer] = useState<Peer.Instance | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [connectionStatus, setConnectionStatus] = useState('Disconnected')
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize peer connection
    const newPeer = new Peer({
      initiator: window.location.hash === '#init',
      trickle: false,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:global.stun.twilio.com:3478' }
        ]
      }
    })

    newPeer.on('signal', (data) => {
      console.log('SIGNAL', JSON.stringify(data))
      // In a real app, you would send this data to the other peer via your signaling server
    })

    newPeer.on('connect', () => {
      setConnectionStatus('Connected')
    })

    newPeer.on('data', (data) => {
      const decodedData = new TextDecoder().decode(data)
      setMessages((prev) => [...prev, { text: decodedData, sender: 'peer' }])
    })

    newPeer.on('stream', (stream) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream
      }
    })

    setPeer(newPeer)

    // Get local media stream
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }
        newPeer.addStream(stream)
      })
      .catch((err) => console.error('Error accessing media devices.', err))

    return () => {
      if (newPeer) {
        newPeer.destroy()
      }
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputMessage.trim() && peer) {
      peer.send(inputMessage)
      setMessages((prev) => [...prev, { text: inputMessage, sender: 'me' }])
      setInputMessage('')
    }
  }

  const toggleAudio = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const audioTrack = (localVideoRef.current.srcObject as MediaStream).getAudioTracks()[0]
      audioTrack.enabled = !audioTrack.enabled
      setIsAudioEnabled(audioTrack.enabled)
    }
  }

  const toggleVideo = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const videoTrack = (localVideoRef.current.srcObject as MediaStream).getVideoTracks()[0]
      videoTrack.enabled = !videoTrack.enabled
      setIsVideoEnabled(videoTrack.enabled)
    }
  }

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">P2P Communication</h1>
      <div className="flex-1 flex gap-4">
        <div className="w-1/2 flex flex-col">
          <div className="relative mb-4 bg-black rounded-lg overflow-hidden">
            <video ref={localVideoRef} autoPlay muted playsInline className="w-full" />
            <div className="absolute bottom-2 left-2 flex gap-2">
              <Button
                size="icon"
                variant={isAudioEnabled ? 'default' : 'destructive'}
                onClick={toggleAudio}
                aria-label={isAudioEnabled ? 'Mute audio' : 'Unmute audio'}
              >
                {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </Button>
              <Button
                size="icon"
                variant={isVideoEnabled ? 'default' : 'destructive'}
                onClick={toggleVideo}
                aria-label={isVideoEnabled ? 'Turn off video' : 'Turn on video'}
              >
                {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="relative flex-1 bg-black rounded-lg overflow-hidden">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="w-1/2 flex flex-col">
          <div className="mb-2 text-sm text-muted-foreground">Status: {connectionStatus}</div>
          <ScrollArea className="flex-1 border rounded-lg p-4 mb-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded-lg ${
                  msg.sender === 'me' ? 'bg-primary text-primary-foreground ml-auto' : 'bg-muted'
                } max-w-[70%]`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </ScrollArea>
          <form onSubmit={sendMessage} className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
