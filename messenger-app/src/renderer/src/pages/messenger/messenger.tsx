import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { VideoCallModal } from '@renderer/components/VideoCallModal'
import { VoiceCallModal } from '@renderer/components/VoiceCallModal'
import { AppDispatch } from '@renderer/stores/store'
import { logout } from '@renderer/stores/userSlice'
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
import { useDispatch } from 'react-redux'

interface User {
  id: string
  name: string
  avatar: string
  lastMessage?: string
  timestamp: string
  online?: boolean
}

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
  // const socketService = new SocketService(dispatch)
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    '1': [
      { id: '1', userId: '1', content: 'Hey, how are you?', timestamp: '10:00 AM' },
      {
        id: '2',
        userId: 'me',
        content: "I'm good, thanks! How about you?",
        timestamp: '10:01 AM',
        isMe: true
      },
      { id: '3', userId: '1', content: 'Doing well! See you tomorrow!', timestamp: '10:02 AM' }
    ],
    '2': [
      { id: '1', userId: '2', content: 'Can you help me with something?', timestamp: '9:30 AM' },
      {
        id: '2',
        userId: 'me',
        content: 'Sure, what do you need?',
        timestamp: '9:31 AM',
        isMe: true
      },
      { id: '3', userId: '2', content: 'Thanks for the help', timestamp: '9:32 AM' }
    ]
  })
  const [newMessage, setNewMessage] = useState('')
  const [attachment, setAttachment] = useState<File | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false)
  const [isVoiceCallOpen, setIsVoiceCallOpen] = useState(false)
  const users: User[] = [
    {
      id: '1',
      name: 'Alex Johnson',
      avatar: '/placeholder.svg?height=40&width=40',
      lastMessage: 'See you tomorrow!',
      timestamp: '2m ago',
      online: true
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      avatar: '/placeholder.svg?height=40&width=40',
      lastMessage: 'Thanks for the help',
      timestamp: '1h ago',
      online: true
    },
    {
      id: '3',
      name: 'Mike Brown',
      avatar: '/placeholder.svg?height=40&width=40',
      lastMessage: 'Great idea!',
      timestamp: '2h ago'
    }
  ]

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase()
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(lowercasedQuery) ||
        user.lastMessage?.toLowerCase().includes(lowercasedQuery)
    )
    setFilteredUsers(filtered)
  }, [searchQuery])

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
    }
  }

  const updateLastMessage = (userId: string, content: string) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, lastMessage: content, timestamp: 'Just now' } : user
    )
    setFilteredUsers(updatedUsers)
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
  const handleVideoCall = () => {
    setIsVideoCallOpen(true)
  }

  const handleVoiceCall = () => {
    setIsVoiceCallOpen(true)
  }
  const handleLogout = () => {
    dispatch(logout())
  }
  return (
    <div className="flex h-full w-full mx-auto border rounded-lg overflow-hidden">
      {/* Sidebar for logged in users */}
      <div className="w-15 border-r bg-muted/10 flex flex-col justify-between">
        {/* User profile */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-center">
            <Avatar className="h-10 w-10 bg-slate-300">
              <AvatarImage src="/placeholder.svg?height=48&width=48" alt="User" />
              <AvatarFallback>U</AvatarFallback>
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
              onClick={() => setActiveChat(user.id)}
              className={`w-full flex items-center gap-3 p-3 hover:bg-slate-100 transition-colors ${
                activeChat === user.id ? 'bg-slate-100' : ''
              }`}
            >
              <div className="relative">
                <Avatar className="bg-slate-300">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                {user.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 border-2 border-background bg-green-500 rounded-full" />
                )}
              </div>
              <div className="flex-1 text-left">
                <div className="flex justify-between">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">{user.timestamp}</span>
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
                  src={users.find((u) => u.id === activeChat)?.avatar}
                  alt={users.find((u) => u.id === activeChat)?.name}
                />
                <AvatarFallback>{users.find((u) => u.id === activeChat)?.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{users.find((u) => u.id === activeChat)?.name}</div>
                <div className="text-xs text-slate-500">Active now</div>
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
                  className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      message.isMe ? 'bg-slate-700 text-white' : 'bg-slate-100'
                    }`}
                  >
                    <p>{message.content}</p>
                    {message.attachment && (
                      <div className="mt-2">
                        {message.attachment.type.startsWith('image/') ? (
                          <img
                            src={message.attachment.url}
                            alt={message.attachment.name}
                            className="max-w-full rounded"
                          />
                        ) : (
                          <a
                            href={message.attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                          >
                            {message.attachment.name}
                          </a>
                        )}
                      </div>
                    )}
                    <span className="text-xs opacity-70">{message.timestamp}</span>
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
                <Input
                  placeholder="Type a message..."
                  className="flex-1"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  aria-label="Type a message"
                />
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
      {activeChat && (
        <>
          <VideoCallModal
            isOpen={isVideoCallOpen}
            onClose={() => setIsVideoCallOpen(false)}
            callee={{
              name: users.find((u) => u.id === activeChat)?.name || '',
              avatar: users.find((u) => u.id === activeChat)?.avatar || ''
            }}
          />
          <VoiceCallModal
            isOpen={isVoiceCallOpen}
            onClose={() => setIsVoiceCallOpen(false)}
            callee={{
              name: users.find((u) => u.id === activeChat)?.name || '',
              avatar: users.find((u) => u.id === activeChat)?.avatar || ''
            }}
          />
        </>
      )}
    </div>
  )
}
