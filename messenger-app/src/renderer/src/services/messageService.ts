import axiosInstance from '@renderer/config/axiosConfig'
import { sendMessage } from './Socket'

const getChatMessagesPath = '/messages'

class MessageService {
  async getChatMessages(senderId: string, receiverId: string) {
    const response = await axiosInstance.get(getChatMessagesPath, {
      params: { senderId, receiverId }
    })
    if (response.data && response.data.success) {
      return response.data.data
    } else {
      throw new Error('Failed to fetch chat messages')
    }
  }
  async sendAttachmentMessage(senderId: string, receiverId: string, attachment: File) {
    const formData = new FormData()
    formData.append('file', attachment)
    const response = await axiosInstance.post('/file/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    console.log('File uploaded:', response.data.data)
    if (response.data && response.data.success) {
      sendMessage(senderId, receiverId, response.data.data)
      return response.data.data
    } else {
      throw new Error('Failed to send attachment message')
    }
  }
}

export default new MessageService()
