const io = require('socket.io')(8800, {
    path:'/socket/socket.io',
    cors:{
        origin:"https://talentf.tk"
    }
})

let activeUsers = []

io.on("connection", (socket) =>{

    //add new user
    socket.on('new-user-add', (newUserId)=> {
        console.log(newUserId,'userid');
        // if user is not added previously
        if(!activeUsers.some((user)=> user.userId === newUserId))
            {
                activeUsers.push({
                    userId: newUserId,
                    socketId: socket.id
                })
            }
            console.log("connected users", activeUsers);
            io.emit('get-users', activeUsers)

    })

    //send Message
    socket.on("send-message", (data)=> {
        const {receiverId} = data;
        const user = activeUsers.find((user)=>user.userId === receiverId)
        console.log('sending from socket to :', receiverId);
        console.log("Data",data);
        if(user){
            io.to(user?.socketId).emit("receive-message",data)
        }
    })

    // SEND NOTIFICATION 
    socket.on("send-notification",(data)=>{
        console.log(data,'hii');
        const {recieverId,senderId,type} = data
        const reciever = activeUsers.find((user)=>user.userId === recieverId)
        console.log(reciever,'noti reciever'); 
        io.to(reciever?.socketId).emit("getNotification",{ 
            senderId,
            type,
        }) 
    })

    // DISCONNECT 
    socket.on("disconnect", ()=> {
        activeUsers = activeUsers.filter((user) => user.socketId !== socket.id)
        console.log("user disconnected",activeUsers);
        io.emit('get-users', activeUsers)
    })

   
})  