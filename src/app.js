const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const _ = require("lodash")

const io = new Server(server, {cors: {
  origin: "http://localhost:19006",
  methods: ["GET", "POST"]
}});

let userList = [];

io.on('connection', (socket) => {
  socket.on('sendMessageToServer', (msg) => {
    const userIndex = _.findIndex(userList, (user)=>{
      return user.userId == msg.to
    })

    if (userIndex !== -1) {
      io.to(userList[userIndex].socketId).emit('sendMessageToClient', msg.message);
    }
  });

  socket.on('userConnect', (userInfo) => {
    const userIndex = _.findIndex(userList, (user)=>{
      return user.userId == userInfo.userId
    })

    if (userIndex === -1) {
      userInfo.socketId= socket.id;
      userList.push(userInfo)
    } else {
      userList[userIndex].socketId = socket.id
    }
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});