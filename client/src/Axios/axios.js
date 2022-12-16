import axios from 'axios'

const baseUrl = process.env.REACT_APP_API_URL

// const baseUrl = 'http://localhost:5000/api'
const instance = axios.create({
    baseURL:baseUrl,

})

export default instance