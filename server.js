const path = require("path");
const http = require("http");
const express =  require("express");
const socketIo = require("socket.io");
const formatMassage = require('./utils/formatMassage');
const { userJoin, getCurrentUser,  userLeave, getRoomUser } = require('./utils/user');
const app = express();

const server = http.createServer(app);
const io = socketIo(server);
const botName = 'Admin';
//set static folder
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {


    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
    
        socket.join(user.room);
    
        // Welcome current user
        socket.emit('message', formatMassage(botName, 'Welcome to ChatBox!'));
    
    //when user leave the chat
    socket.broadcast.to(user.room).emit('message', formatMassage(botName,`${user.username} Has Join the chat`));


    io.to(user.room).emit('roomUsers', {
        room : user.room,
        users : getRoomUser(user.room),
        curruntUser : getCurrentUser(socket.id)
    });
    });


    socket.on('chatMassage', (msg) => {
        const user = getCurrentUser(socket.id);
        console.log(user);

        io.to(user.room).emit('message', formatMassage(user.username,msg)); 
    });


      //when user disconnect
      socket.on('disconnect' , () => {
          const user = userLeave(socket.id);

          if(user){
              io.to(user.room).emit('message', formatMassage(botName,`${ user.username } has Leave the chat`));

              io.to(user.room).emit('roomUsers', {
                room : user.room,
                users : getRoomUser(user.room)
            });
          }
    });
})

const PORT = process.env.PORT || 8000 ;
server.listen(PORT, () => console.log(`server running on port ${PORT}`));