import { createSlice } from '@reduxjs/toolkit'

    let profilePic = localStorage.getItem('profilePic')

   const defaultUser = JSON.parse(localStorage.getItem('user'))

if( typeof(profilePic) !== 'undefiened'){

    profilePic = JSON.parse(localStorage.getItem('profilePic'))
}

if(defaultUser){
    var {fullName,userName,accountType,_id,about} = defaultUser
}


const userSlice = createSlice({
    name:'user',
    initialState:{
        _id,
        fullName,
        userName,
        accountType,
        about,
        profilePic
    },
    reducers:{
        update:(state,action)=>{
            state._id = action.payload._id
            state.fullName = action.payload.fullName
            state.userName = action.payload.userName
            state.accountType = action.payload.accountType
            state.about = action.payload.about
        }, 
        setProfilePic:(state,action)=>{
            state.profilePic = action.payload.profilePic
        },
        remove:(state) => {state ={} }
    },
});


export const {update, remove, setProfilePic} = userSlice.actions;

// export const allUserData = (state)=>state.user;

export default userSlice.reducer;
