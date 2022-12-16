import axios from '../Axios/axios'

export const getMessages = (id)=>axios.get(`/message/${id}`)

export const addMessage = (data) => axios.post('/message/',data)