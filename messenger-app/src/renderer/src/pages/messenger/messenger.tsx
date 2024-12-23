import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { IncomingCallModal } from '@renderer/components/incoming-call-modal'
import RoomJoinModal from '@renderer/components/RoomJoinModal'
import { toast } from '@renderer/components/ui/use-toast'
import { VideoCallModal } from '@renderer/components/VideoCallModal'
import authService from '@renderer/services/authService'
import listUsersService from '@renderer/services/listUsersService'
import messageService from '@renderer/services/messageService'
import {
  connectWebSocket,
  disconnectWebSocket,
  sendAnswer,
  sendCandidate,
  sendMessage,
  sendVideoCall,
  sendVideoCallAccept,
  sendVideoCallEnd,
  sendVideoCallReject
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
  VideoIcon,
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
  const [isGroupCallOpen, setIsGroupCallOpen] = useState(false)
  const [roomId, setRoomId] = useState('')
  const onCreateRoom = () => {}
  const onJoinRoom = () => {}
  // Video call
  const iceServers = useRef<RTCIceServer[]>([
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun.l.google.com:5349' },
    { urls: 'stun:stun1.l.google.com:3478' },
    { urls: 'stun:stun1.l.google.com:5349' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:5349' },
    { urls: 'stun:stun3.l.google.com:3478' },
    { urls: 'stun:stun3.l.google.com:5349' },
    { urls: 'stun:stun4.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:5349' },
    { urls: 'stun:stun5.l.google.com:19302' },
    { urls: 'stun:stun5.l.google.com:5349' }
  ])
  // const localVideoRef = useRef<HTMLVideoElement>(null)
  // const remoteVideoRef = useRef<HTMLVideoElement>(null)

  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  // const [localPeer, setLocalPeer] = useState<RTCPeerConnection | null>(null)
  const localPeer = useRef<RTCPeerConnection | null>(null)
  const remotePeer = useRef<RTCPeerConnection | null>(null)
  // const [remotePeer, setRemotePeer] = useState<RTCPeerConnection | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [isFullScreen, setIsFullScreen] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isCallAccepted, setIsCallAccepted] = useState(false)
  // ================================
  // Step 1: Create local peer connection
  const createPeerConnection = async () => {
    try {
      // const peer = new RTCPeerConnection({ iceServers: iceServers.current })
      // localPeer.current = peer
      localPeer.current = new RTCPeerConnection({ iceServers: iceServers.current })
      console.log('localPeer.current', localPeer.current)
    } catch (error) {
      console.error('Error creating local peer connection:', error)
    }
  }
  // Step 2: Initialize local stream
  const initializeLocalVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: !isVideoOff,
        audio: !isMuted
      })
      setLocalStream(stream)
    } catch (error) {
      console.error('Error initializing local video:', error)
    }
  }
  // Step 3: On call received
  const onCallReceived = (call) => {
    console.log('Received call:', call.body)
    setIsIncomingCallOpen(true)
    // Find th user name depend on id
    const user = listUsers.find((user) => user.id === call.body)
    if (user) {
      setCallerName(user.username)
    } else {
      setCallerName('Người lạ')
    }
  }
  // Step 4: On call offer
  const onCallOffer = (offer) => {
    console.log('Received offer:', offer)
    console.log('offer.body: ', offer.body)
    const o = JSON.parse(offer.body)['offer']
    console.log('o', o)
    console.log(new RTCSessionDescription(o))
    console.log(typeof new RTCSessionDescription(o))
    if (localPeer.current) {
      console.log('localPeer.current', localPeer.current)
      localPeer.current.ontrack = (event) => {
        console.log('Local stream: ', event)
        console.log('event.streams', event.streams)
        setRemoteStream(event.streams[0])
      }
      localPeer.current.onicecandidate = (event) => {
        console.log('Local ice candidate: ', event)
        if (event.candidate) {
          console.log('Candidate: ', event.candidate)
          const candidate = {
            type: 'candidate',
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.candidate
          }
          console.log('Sneding candidate: ', candidate)
          sendCandidate(currentUser?.id || '', activeChat || '', candidate)
        }
      }
      // Adding Audio and Video Local Peer
      localStream?.getTracks().forEach((track) => {
        localPeer.current?.addTrack(track, localStream)
      })
      // Description
      localPeer.current?.setRemoteDescription(new RTCSessionDescription(o))
      // Create answer
      localPeer.current?.createAnswer().then((answer) => {
        console.log('Answer: ', answer)
        localPeer.current?.setLocalDescription(answer)
        sendAnswer(currentUser?.id || '', activeChat || '', answer)
      })
    } else {
      console.log('localPeer.current is null')
      console.log('currentUser', currentUser)
      console.log('activeChat', activeChat)
    }
  }
  // Step 5: On call answer
  const onCallAnswer = (answer) => {
    console.log('Received answer:', answer)
    const o = JSON.parse(answer.body)['answer']
    console.log('o', o)
    console.log(new RTCSessionDescription(o))
    console.log(typeof new RTCSessionDescription(o))
    if (localPeer.current) {
      localPeer.current.setRemoteDescription(new RTCSessionDescription(o))
    }
  }
  // Step 6: On call candidate
  const onCallCandidate = (candidate) => {
    console.log('Received candidate:', candidate)
    const o = JSON.parse(candidate.body)['candidate']
    console.log('o', o)
    console.log(o['lable'])
    console.log(o['id'])
    const iceCandidate = new RTCIceCandidate({
      candidate: o['id'],
      sdpMLineIndex: o['label']
    })
    localPeer.current?.addIceCandidate(iceCandidate)
  }
  // Step 7: On call end
  const onCallEnd = (end) => {
    console.log('Call ended: ', end)
    setIsVideoCallOpen(false)
  }
  // Step 8: On call reject
  const onCallReject = (reject) => {
    console.log('Call rejected: ', reject)
  }
  // Step 10: On call accept
  const onCallAccept = (accept) => {
    if (!activeChat || !currentUser?.id || !localPeer.current) {
      console.error('Missing required data for call accept')
      return
    }

    console.log('Call accepted:', accept)
    setIsIncomingCallOpen(false)

    localPeer.current.ontrack = (event) => {
      setRemoteStream(event.streams[0])
    }

    // ... rest of function
  }
  // Step 10: On call signal
  const onSignalReceived = (signal) => {
    console.log('Received signal:', signal)
  }
  // HANDLE VIDEO CALL
  const handleVideoCall = async () => {
    if (!activeChat || !currentUser?.id) {
      console.error('No active chat or current user')
      return
    }

    setIsIncomingCallOpen(false)
    sendVideoCall(currentUser.id, activeChat)
    setIsVideoCallOpen(true)
    await initializeLocalVideo()
    await createPeerConnection()
  }
  const handleAnswer = async () => {
    if (currentUser?.id && activeChat) {
      sendVideoCallAccept(currentUser?.id || '', activeChat || '')
    } else {
      console.log('currentUser?.id or activeChat is null')
    }
    setIsIncomingCallOpen(false)
    setIsVideoCallOpen(true)
    initializeLocalVideo()
    await createPeerConnection()
  }
  const handleDecline = () => {
    if (currentUser?.id && activeChat) {
      sendVideoCallReject(currentUser?.id || '', activeChat || '')
    } else {
      console.log('currentUser?.id or activeChat is null')
    }
    setIsIncomingCallOpen(false)
    setIsVideoCallOpen(false)
  }
  const handleEndCall = () => {
    if (currentUser?.id && activeChat) {
      sendVideoCallEnd(currentUser?.id || '', activeChat || '')
    } else {
      console.log('currentUser?.id or activeChat is null')
    }
    setIsVideoCallOpen(false)
  }
  // ================================
  // Handle message from server

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

    connectWebSocket(
      handleMessage,
      currentUser?.id || '',
      onSignalReceived,
      onCallReceived,
      onCallOffer,
      onCallAnswer,
      onCallCandidate,
      onCallEnd,
      onCallReject,
      onCallAccept
    )
    fetchUsers()
    return () => {
      disconnectWebSocket()
    }
  }, [currentUser])

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
      console.log('userId-activeChat', userId)
      setActiveChat(userId)
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

    console.log('userId', userId)
    // Initialize empty message array if it doesn't exist
    setMessages((prev) => ({
      ...prev,
      [userId]: prev[userId] || []
    }))
  }
  const handleGroupCall = () => {
    setIsGroupCallOpen(!isGroupCallOpen)
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
            {/* Add button for group call */}
            <Button
              variant="ghost"
              size="icon"
              className="w-full hover:bg-slate-200"
              aria-label="Group call"
              onClick={handleGroupCall}
            >
              <VideoIcon className="h-5 w-5" />
            </Button>
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
          localVideoRef={localStream}
          remoteVideoRef={remoteStream}
          endCall={handleEndCall}
          isOpen={isVideoCallOpen}
          onClose={() => setIsVideoCallOpen(false)}
        />
      )}
      {isIncomingCallOpen && (
        <IncomingCallModal
          callerName={callerName}
          onAnswer={handleAnswer}
          onDecline={handleDecline}
        />
      )}
      {isGroupCallOpen && (
        <RoomJoinModal
          isOpen={isGroupCallOpen}
          setIsOpen={setIsGroupCallOpen}
          setRoomId={setRoomId}
        />
      )}
    </div>
  )
}
