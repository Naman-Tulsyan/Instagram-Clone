import { createSlice } from "@reduxjs/toolkit"

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        onlineUser: [],
        messages: [],
        selectedConversation: null,
    },
    reducers: {
        setOnlineUser : (state, action) => {
            state.onlineUser = action.payload
        },
        setMessage: (state, action) => {
  if (typeof action.payload === "function") {
    // Functional update (for real-time appending)
    state.messages = action.payload(state.messages);
  } else {
    // Direct set
    state.messages = action.payload;
  }
},
        setSelectedConversation : (state, action) => {
            state.selectedConversation = action.payload
        }
    }
})

export const {setOnlineUser, setMessage, setSelectedConversation} = chatSlice.actions;
export default chatSlice.reducer