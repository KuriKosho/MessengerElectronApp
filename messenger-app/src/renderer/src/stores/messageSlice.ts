import { PayloadAction } from '@reduxjs/toolkit'

import { createSlice } from '@reduxjs/toolkit'

export interface Message {
  id: string
  content: string
  sender: string
  receiver: string
}

export interface MessageState {
  messages: Message[]
}

const initialState: MessageState = {
  messages: []
}

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload
    }
  }
})

export const { setMessages } = messageSlice.actions
export default messageSlice.reducer
