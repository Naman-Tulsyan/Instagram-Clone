import { createSlice } from "@reduxjs/toolkit"

const postSlice = createSlice({
    name: "post",
    initialState : {
        post: [],
        isLoading : false,
        error: null
    },
    reducers: {
        setPosts: (state, action) => {
            state.post = action.payload
        },
        setPostIsLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setPostErr: (state, action) => {
            state.error = action.payload
        }
    }
})

export const {setPosts, setPostIsLoading, setPostErr} = postSlice.actions
export default postSlice.reducer