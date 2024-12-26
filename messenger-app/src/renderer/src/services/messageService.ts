import axiosInstance from '@renderer/config/axiosConfig'

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
    formData.append('senderId', senderId)
    formData.append('receiverId', receiverId)
    formData.append('file', attachment)
    const response = await axiosInstance.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    if (response.data && response.data.success) {
      return response.data.data
    } else {
      throw new Error('Failed to send attachment message')
    }
  }
}

export default new MessageService()
