import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { IncomingCallModal } from '@renderer/components/incoming-call-modal'
import { toast } from '@renderer/components/ui/use-toast'
import { VideoCallModal } from '@renderer/components/VideoCallModal'
import authService from '@renderer/services/authService'
import listUsersService from '@renderer/services/listUsersService'
import messageService from '@renderer/services/messageService'
import {
  connectWebSocket,
  disconnectWebSocket,
  sendMessage,
  sendSignal
} from '@renderer/services/Socket'
import { User } from '@renderer/stores/listUsersSlice'
import { AppDispatch, RootState } from '@renderer/stores/store'
import { calculateTimeAgo } from '@renderer/utils'
import {
  LogOut,
  MessageCircle,
  MoreVertical,
  Paperclip,
  Phone,
  Search,
  Send,
  Settings,
  Video,
  X
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

interface Attachment {
  name: string
  url: string
  type: string
}

interface Message {
  id: string
  userId: string
  content: string
  timestamp: string
  isMe?: boolean
  attachment?: Attachment
}

export default function Messenger() {
  const dispatch = useDispatch<AppDispatch>()
  const currentUser = useSelector((state: RootState) => state.user.currentUser)
  const users: User[] = useSelector((state: RootState) => state.listUsers.users)
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [activeChatUser, setActiveChatUser] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [listUsers, setListUsers] = useState<User[]>([])
  const [messages, setMessages] = useState<Record<string, Message[]>>({})
  const [newMessage, setNewMessage] = useState('')
  const [attachment, setAttachment] = useState<File | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false)
  const [isVoiceCallOpen, setIsVoiceCallOpen] = useState(false)
  const [isIncomingCallOpen, setIsIncomingCallOpen] = useState(false)
  const [callerName, setCallerName] = useState('Người lạ')
  // Video call
  const rtcConfiguration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  }
  const localVideoRef = useRef<HTMLVideoElement | null>(null)
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  // Handle message from server

  const createOffer = async () => {
    if (!peerConnectionRef.current || !localStreamRef.current) return

    const offer = await peerConnectionRef.current.createOffer()
    await peerConnectionRef.current.setLocalDescription(offer)

    sendSignal(currentUser?.username || '', currentUser?.id || '', activeChat || '', 'offer', {
      type: 'offer',
      sdp: offer.sdp
    })
  }
  const createAnswer = async () => {
    if (!peerConnectionRef.current) return

    const answer = await peerConnectionRef.current.createAnswer()
    await peerConnectionRef.current.setLocalDescription(answer)

    sendSignal(currentUser?.username || '', currentUser?.id || '', activeChat || '', 'answer', {
      type: 'answer',
      sdp: answer.sdp
    })
  }
  const initializeLocalVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      localStreamRef.current = stream
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }
      // Gửi video/audio của mình đến peer connection
      if (peerConnectionRef.current) {
        stream.getTracks().forEach((track) => peerConnectionRef.current?.addTrack(track, stream))
      }
    } catch (error) {
      console.error('Error accessing media devices.', error)
    }
  }
  const createPeerConnection = () => {
    const peerConnection = new RTCPeerConnection(rtcConfiguration)

    // Lắng nghe ICE candidates
    peerConnection.onicecandidate = ({ candidate }) => {
      if (candidate) {
        sendSignal(
          currentUser?.username || '',
          currentUser?.id || '',
          activeChat || '',
          'candidate',
          {
            type: 'candidate',
            candidate
          }
        )
      }
    }

    //   // Lắng nghe media stream từ remote peer
    peerConnection.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0]
      }
    }

    //   // Quản lý sự thay đổi kết nối
    peerConnection.onconnectionstatechange = () => {
      const connectionState = peerConnection.iceConnectionState
      if (connectionState === 'disconnected' || connectionState === 'failed') {
        console.log('Connection lost, stopping current call.')
        setIsVideoCallOpen(false)
      }
      peerConnectionRef.current = peerConnection
    }
  }
  // Kết thúc cuộc gọi
  const endCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop())
      localStreamRef.current = null
    }
    sendSignal(currentUser?.username || '', currentUser?.id || '', activeChat || '', 'stop', {
      type: 'stop'
    })
    setIsVideoCallOpen(false)
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log('users', currentUser?.id)
        const users = await listUsersService.listUsers(dispatch, currentUser?.id || '')
        if (users) {
          // Filter out the current user from the list
          const filteredUsers = users.filter((user) => user.id !== currentUser?.id)
          setListUsers(filteredUsers)
        }
      } catch (error) {
        console.error('Failed to fetch users:', error)
      }
    }
    const handleMessage = (message) => {
      if (message.senderId && message.content) {
        const newMsg: Message = {
          id: message.id,
          userId: message.senderId,
          content: message.content,
          timestamp: new Date().toLocaleTimeString(),
          isMe: message.senderId === currentUser?.id
        }

        setMessages((prev) => {
          const chatId =
            message.senderId === currentUser?.id ? message.receiverId : message.senderId
          return {
            ...prev,
            [chatId]: [...(prev[chatId] || []), newMsg]
          }
        })
      }
    }
    // Handle signaling from server
    const handleSignal = (signal) => {
      console.log('Received signal:', signal)
      if (signal.type === 'offer') {
        setIsIncomingCallOpen(true)
        setCallerName(signal.name)
        createOffer()
      }
      if (signal.type === 'answer') {
        createAnswer()
      }
      if (signal.type === 'candidate') {
        peerConnectionRef.current?.addIceCandidate(new RTCIceCandidate(signal.candidate))
      }
    }
    connectWebSocket(handleMessage, currentUser?.id || '', handleSignal)
    fetchUsers()
    return () => {
      disconnectWebSocket()
    }
  }, [currentUser])
  const onAnswer = () => {
    if (currentUser?.id) {
      sendSignal(currentUser.username, currentUser.id, activeChat || '', 'answer', {
        type: 'answer',
        sdp: 'answer.sdp'
      })
      setIsIncomingCallOpen(false)
      setIsVideoCallOpen(true)
    }
  }
  const onDecline = () => {
    if (currentUser?.id) {
      sendSignal(currentUser.username, currentUser.id, activeChat || '', 'stop', {
        type: 'stop'
      })
    }
    setIsIncomingCallOpen(false)
    endCall()
  }
  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase()
    const filtered = listUsers?.filter(
      (user) =>
        user.username.toLowerCase().includes(lowercasedQuery) ||
        user.lastMessage?.toLowerCase().includes(lowercasedQuery)
    )
    setFilteredUsers(filtered)
  }, [searchQuery, listUsers])

  useEffect(() => {
    scrollToBottom()
  }, [messages, activeChat])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if ((newMessage.trim() || attachment) && activeChat) {
      const newMsg: Message = {
        id: Date.now().toString(),
        userId: 'me',
        content: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true
      }

      if (attachment) {
        newMsg.attachment = {
          name: attachment.name,
          url: URL.createObjectURL(attachment),
          type: attachment.type
        }
      }
      setMessages((prevMessages) => ({
        ...prevMessages,
        [activeChat]: [...(prevMessages[activeChat] || []), newMsg]
      }))
      setNewMessage('')
      setAttachment(null)
      updateLastMessage(activeChat, newMessage.trim() || 'Sent an attachment')
      if (currentUser?.id) {
        sendMessage(currentUser.id, activeChat, newMessage.trim() || 'Sent an attachment')
      }
    }
  }

  const updateLastMessage = (userId: string, content: string) => {
    const updatedUsers = listUsers.map((user) =>
      user.id === userId ? { ...user, lastMessage: content, timestamp: 'Just now' } : user
    )
    setListUsers(updatedUsers)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0])
    }
  }

  const handleRemoveAttachment = () => {
    setAttachment(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }
  const handleVideoCall = async () => {
    setIsIncomingCallOpen(false)
    setIsVideoCallOpen(true)
    console.log('Video call open: ', isVideoCallOpen)
    if (currentUser?.id) {
      console.log('destination', `/user/${currentUser.id}/queue/signaling`)
      sendSignal(currentUser.username, currentUser.id, activeChat || '', 'offer', {
        type: 'offer',
        sdp: 'offer.sdp'
      })
      await initializeLocalVideo()
      createPeerConnection()
    }
  }

  const handleVoiceCall = () => {
    setIsVoiceCallOpen(true)
  }
  const handleLogout = async () => {
    try {
      console.log('currentUser', currentUser)
      await authService.logout(currentUser?.email || 'no email', dispatch)
      toast({
        variant: 'default',
        title: 'Logout Success',
        description: 'You are now logged out'
      })
    } catch (error) {
      console.error('Logout failed:', error)
      toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: 'An error occurred during logout'
      })
    }
  }
  const setActiveChatId = async (userId: string) => {
    try {
      const messages = await messageService.getChatMessages(currentUser?.id || '', userId)
      // setMessages((prev) => ({
      //   ...prev,
      //   [userId]: messages
      // }))
      // Set isMe to true for the messages
      const updatedMessages = messages.map((message) => ({
        ...message,
        isMe: message.senderId === currentUser?.id
      }))
      // Format timestamp
      const formattedMessages = updatedMessages.map((message) => ({
        ...message,
        timestamp: new Date(message.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      }))
      setMessages((prev) => ({
        ...prev,
        [userId]: formattedMessages
      }))
    } catch (error) {
      console.error('Failed to fetch chat messages:', error)
    }
    setActiveChat(userId)
    console.log('userId', userId)
    // Initialize empty message array if it doesn't exist
    setMessages((prev) => ({
      ...prev,
      [userId]: prev[userId] || []
    }))
  }
  return (
    <div className="flex h-full w-full mx-auto border rounded-lg overflow-hidden relative">
      {/* Sidebar for logged in users */}
      <div className="w-15 border-r bg-muted/10 flex flex-col justify-between">
        {/* User profile */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-center">
            <Avatar className="h-10 w-10 bg-slate-300">
              <AvatarImage src="/placeholder.svg?height=48&width=48" alt="User" />
              <AvatarFallback>{currentUser?.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Action buttons at bottom */}
        <div className="mt-auto">
          <div className="p-4 flex flex-col gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="w-full hover:bg-slate-200"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-full hover:bg-slate-200 text-red-500 hover:text-red-600"
              aria-label="Logout"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      {/* Sidebar */}
      <div className="w-80 border-r bg-muted/10">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search chats..."
              className="pl-8 bg-slate-100"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>
        <ScrollArea className="h-[calc(600px-69px)]">
          {filteredUsers.map((user) => (
            <button
              key={user.id}
              onClick={() => setActiveChatId(user.id)}
              className={`w-full flex items-center gap-3 p-3 hover:bg-slate-100 transition-colors ${
                activeChat === user.id ? 'bg-slate-100' : ''
              }`}
            >
              <div className="relative">
                <Avatar className="bg-slate-300">
                  <AvatarImage src={user.avatar} alt={user.username} />
                  <AvatarFallback>{user.username[0]}</AvatarFallback>
                </Avatar>
                {user.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 border-2 border-background bg-green-500 rounded-full" />
                )}
              </div>
              <div className="flex-1 text-left">
                <div className="flex justify-between">
                  <span className="font-medium">{user.username}</span>
                  <span className="text-xs text-muted-foreground">
                    {calculateTimeAgo(user.timeStamp || '')}
                  </span>
                </div>
                {user.lastMessage && (
                  <p className="text-sm text-muted-foreground truncate">{user.lastMessage}</p>
                )}
              </div>
            </button>
          ))}
        </ScrollArea>
      </div>

      {/* Chat Window */}
      {activeChat ? (
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="bg-slate-300">
                <AvatarImage
                  src={listUsers.find((u) => u.id === activeChat)?.avatar}
                  alt={listUsers.find((u) => u.id === activeChat)?.username}
                />
                <AvatarFallback>
                  {listUsers.find((u) => u.id === activeChat)?.username[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">
                  {listUsers.find((u) => u.id === activeChat)?.username}
                </div>
                <div className="text-xs text-slate-500">
                  {listUsers.find((u) => u.id === activeChat)?.online ? 'Active now' : 'Offline'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" aria-label="Phone call" onClick={handleVoiceCall}>
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Video call" onClick={handleVideoCall}>
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="More options">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages[activeChat]?.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message?.isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      message.isMe ? 'bg-slate-700 text-white' : 'bg-slate-100'
                    }`}
                  >
                    <p>{message?.content}</p>
                    {message?.attachment && (
                      <div className="mt-2">
                        {message?.attachment?.type?.startsWith('image/') ? (
                          <img
                            src={message?.attachment?.url}
                            alt={message?.attachment?.name}
                            className="max-w-full rounded"
                          />
                        ) : (
                          <a
                            href={message?.attachment?.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                          >
                            {message?.attachment?.name}
                          </a>
                        )}
                      </div>
                    )}
                    <span className="text-xs opacity-70">{message?.timestamp}</span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex flex-col gap-2">
              {attachment && (
                <div className="flex items-center gap-2 bg-slate-200 p-2 rounded">
                  <Paperclip className="h-4 w-4" />
                  <span className="text-sm truncate">{attachment.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="ml-auto"
                    onClick={handleRemoveAttachment}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  aria-label="Attach file"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Attach file"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  className="flex-1"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  aria-label="Type a message"
                />

                <Button
                  type="submit"
                  size="icon"
                  aria-label="Send message"
                  className="text-white bg-blue-500"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <MessageCircle className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-medium">Select a chat to start messaging</h3>
          </div>
        </div>
      )}
      {isVideoCallOpen && (
        <VideoCallModal
          callee={{
            name: listUsers.find((u) => u.id === activeChat)?.username || '',
            avatar: listUsers.find((u) => u.id === activeChat)?.avatar || ''
          }}
          senderId={currentUser?.id || ''}
          receiverId={activeChat || ''}
          localVideoRef={localVideoRef}
          remoteVideoRef={remoteVideoRef}
          peerConnectionRef={peerConnectionRef}
          localStreamRef={localStreamRef}
          endCall={endCall}
        />
      )}
      {isIncomingCallOpen && (
        <IncomingCallModal callerName={callerName} onAnswer={onAnswer} onDecline={onDecline} />
      )}
    </div>
  )
}
