import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    AnotherUserId:null
}

const anotherUserSlice = createSlice({
    name:'anotheruser',
    initialState,
    reducers:{
        addMessage:(state,action)=>{
            state.AnotherUserId = action.payload
        },
        removeId:(state,action)=>{
            state.AnotherUserId = null
        }
    }

})

export const {addMessage, removeId } = anotherUserSlice.actions
export default anotherUserSlice.reducer