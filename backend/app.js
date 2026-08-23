import express from "express";
import { createServer } from "http";
// import initializeSocket from "./controller/socketManager.js";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server);
const users = {};

app.use(express.static("../frontend"));

io.on("connect", (socket) => {
    console.log("connection established :", socket.id);

    socket.on("join", (username) => {
        socket.username = username;

        users[socket.id] = username;
        console.log(`${username} Joined.!`);

        io.emit("userJoined", `${username} >> joined the chat`);

        io.emit("onlineUsers", Object.values(users));
    })

    socket.on("message", (data) => {
        io.emit("message", {
            text: data,
            sender: socket.username,
            id: socket.id
        });
    });

   socket.on("disconnect", () => {
        console.log("user disconnected : ", socket.username);

        delete users[socket.id];
        io.emit("userLeft", `${socket.username} << left the chat`)

        io.emit("onlineUsers",Object.values(users));
   })
});

export default server;
