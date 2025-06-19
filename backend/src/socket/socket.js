import { Server } from "socket.io";
import express from "express";
import http from "http";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {};

export const getSocketId = (receiverId) => {
  return userSocketMap[receiverId];
}

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if(userId){
        userSocketMap[userId] = socket.id;
        console.log(`User Connected, UserId : ${userId}, SocketId : ${socket.id}`)
    }

    io.emit('getOnlineUser', Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        if(userId){
            delete userSocketMap[userId];
            console.log(`User Disonnected, UserId : ${userId}, SocketId : ${socket.id}`)
        }
        io.emit('getOnlineUser', Object.keys(userSocketMap));
    })
})

export {app, io, server} ;