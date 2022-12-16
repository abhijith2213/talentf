require("dotenv").config();

const express = require('express')
const server = express()
const userRouter = require('./Routes/user')
const adminRouter = require('./Routes/admin')
const chatRouter = require('./Routes/chat')
const messageRouter = require('./Routes/message')
const worksRouter = require('./Routes/works')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const port = process.env.PORT
const {connectDb} = require('./config/connections');
const verifyJWT = require("./Middlewares/verifyJWT");


server.use(express.json())
server.use(bodyParser.urlencoded({extended:true}))

server.use(cors())


server.use('/images',express.static(path.join(__dirname,'public/images')))

/* ---------------------------------- Routes --------------------------------- */

server.use('/api',userRouter)
server.use('/api/admin',adminRouter)
server.use('/api/chat',chatRouter)
server.use('/api/message',messageRouter)
server.use('/api/works',worksRouter)

/* ---------------------------- Connect Database ---------------------------- */

connectDb();

/* ------------------------------ PORT SETTING ------------------------------ */

server.listen(port,()=>{
    console.log('Server Started Successfully!');
})


module.exports = server;