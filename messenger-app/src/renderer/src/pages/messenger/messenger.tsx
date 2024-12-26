import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import Layout from '@renderer/components/layout'
import RoomJoinModal from '@renderer/components/RoomJoinModal'
import listUsersService from '@renderer/services/listUsersService'
import messageService from '@renderer/services/messageService'
import { connectWebSocket, disconnectWebSocket, sendMessage } from '@renderer/services/Socket'
import { User } from '@renderer/stores/listUsersSlice'
import { AppDispatch, RootState } from '@renderer/stores/store'
import { calculateTimeAgo } from '@renderer/utils'
import { MessageCircle, MoreVertical, Paperclip, Phone, Search, Send, Video, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
interface Attachment {
  name: string
  url: string
  type: string
  file?: File
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
  const navigate = useNavigate()
  const currentUser = useSelector((state: RootState) => state.user.currentUser)
  const users: User[] = useSelector((state: RootState) => state.listUsers.users)
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [listUsers, setListUsers] = useState<User[]>([])
  const [messages, setMessages] = useState<Record<string, Message[]>>({})
  const [newMessage, setNewMessage] = useState('')
  const [attachment, setAttachment] = useState<File | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isGroupCallOpen, setIsGroupCallOpen] = useState(false)
  const [roomId, setRoomId] = useState('')
  const onCreateRoom = () => {}
  const onJoinRoom = () => {}
  // Video call

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

    connectWebSocket(handleMessage, currentUser?.id || '')
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
          type: attachment.type,
          file: attachment
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
        if (!attachment) {
          sendMessage(currentUser.id, activeChat, newMessage.trim())
        } else {
          messageService.sendAttachmentMessage(currentUser.id, activeChat, attachment)
        }
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

  const setActiveChatId = async (userId: string) => {
    try {
      console.log('userId-activeChat', userId)
      setActiveChat(userId)
      const messages = await messageService.getChatMessages(currentUser?.id || '', userId)
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
  return (
    <div className="flex h-full w-full mx-auto border rounded-lg overflow-hidden relative">
      {/* Sidebar for logged in users */}
      <Layout />
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
        {/* <ScrollArea className="h-[calc(600px-69px)]"> */}
        <ScrollArea className="h-[calc(100%-69px)]">
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
              <Button variant="ghost" size="icon" aria-label="Phone call">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Video call">
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
