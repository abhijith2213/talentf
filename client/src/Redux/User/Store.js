import { configureStore } from '@reduxjs/toolkit'

import userReducer from './userSlice'
import anotheruserReducer from './message'

export default configureStore({
    reducer:{
        user:userReducer,
        anotheruser:anotheruserReducer,

    },
})