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
}

export default new MessageService()
