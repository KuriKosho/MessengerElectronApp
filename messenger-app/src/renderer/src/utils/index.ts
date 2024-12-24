import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const WEBSOCKET_URL = 'http://172.20.10.3:8443/ws'
export const SIGNALING_URL = 'http: //172.20.10.3:8443/websocket'
export const API_URL = 'http://172.20.10.3:8443/api'
const dateFormatter = new Intl.DateTimeFormat(window.context.locale, {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'UTC'
})

export const formatDateFromMs = (ms: number) => dateFormatter.format(ms)

export const cn = (...args: ClassValue[]) => {
  return twMerge(clsx(...args))
}

export const calculateTimeAgo = (timestamp: string) => {
  const now = new Date()
  const messageDate = new Date(timestamp)
  const timeAgo = now.getTime() - messageDate.getTime()
  const timeAgoInSeconds = Math.floor(timeAgo / 1000)
  const timeAgoInMinutes = Math.floor(timeAgoInSeconds / 60)
  const timeAgoInHours = Math.floor(timeAgoInMinutes / 60)
  const timeAgoInDays = Math.floor(timeAgoInHours / 24)
  if (timeAgoInDays > 0) {
    return `${timeAgoInDays}d`
  } else if (timeAgoInHours > 0) {
    return `${timeAgoInHours}h`
  } else if (timeAgoInMinutes > 0) {
    return `${timeAgoInMinutes}m`
  } else if (timeAgoInSeconds > 0) {
    return `${timeAgoInSeconds}s`
  } else {
    return 'Active now'
  }
}
// const users: User[] = [
//   {
//     id: '1',
//     name: 'Alex Johnson',
//     avatar: '/placeholder.svg?height=40&width=40',
//     lastMessage: 'See you tomorrow!',
//     timestamp: '2m ago',
//     online: true
//   },
//   {
//     id: '2',
//     name: 'Sarah Wilson',
//     avatar: '/placeholder.svg?height=40&width=40',
//     lastMessage: 'Thanks for the help',
//     timestamp: '1h ago',
//     online: true
//   },
//   {
//     id: '3',
//     name: 'Mike Brown',
//     avatar: '/placeholder.svg?height=40&width=40',
//     lastMessage: 'Great idea!',
//     timestamp: '2h ago'
//   }
// ]s
// const [messages, setMessages] = useState<Record<string, Message[]>>({
//   '1': [
//     { id: '1', userId: '1', content: 'Hey, how are you?', timestamp: '10:00 AM' },
//     {
//       id: '2',
//       userId: 'me',
//       content: "I'm good, thanks! How about you?",
//       timestamp: '10:01 AM',
//       isMe: true
//     },
//     { id: '3', userId: '1', content: 'Doing well! See you tomorrow!', timestamp: '10:02 AM' }
//   ],
//   '2': [
//     { id: '1', userId: '2', content: 'Can you help me with something?', timestamp: '9:30 AM' },
//     {
//       id: '2',
//       userId: 'me',
//       content: 'Sure, what do you need?',
//       timestamp: '9:31 AM',
//       isMe: true
//     },
//     { id: '3', userId: '2', content: 'Thanks for the help', timestamp: '9:32 AM' }
//   ]
// })
