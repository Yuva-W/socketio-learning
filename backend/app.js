import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server);

const users = {};

app.use(express.static("../frontend"));


// ==============================
// SOCKET CONNECTION
// ==============================

io.on("connect", (socket) => {

    console.log("Connection established:", socket.id);


    // ==============================
    // 1. JOIN WITH USERNAME
    // ==============================

    socket.on("join", (username) => {

        socket.username = username;

        users[socket.id] = username;

        console.log(`${username} joined`);

    });


    // ==============================
    // 2. JOIN ROOM
    // ==============================

    socket.on("joinRoom", (room) => {

        if (!socket.username) return;

        socket.join(room);

        socket.room = room;

        console.log(
            `${socket.username} joined room: ${room}`
        );

        // Tell user that room was joined
        socket.emit("roomJoined", room);

        // Tell other users in room
        socket.to(room).emit(
            "userJoinedRoom",
            `${socket.username} joined ${room}`
        );

    });


    // ==============================
    // 3. JOIN CHAT
    // ==============================

    socket.on("joinChat", () => {

        if (!socket.username || !socket.room) return;

        console.log(
            `${socket.username} joined chat in ${socket.room}`
        );

        // Tell other users
        socket.to(socket.room).emit(
            "userJoined",
            `${socket.username} joined the chat`
        );

        // Send online users of this room
        const roomUsers = [];

        for (const id in users) {

            const userSocket = io.sockets.sockets.get(id);

            if (
                userSocket &&
                userSocket.room === socket.room
            ) {
                roomUsers.push(users[id]);
            }
        }

        io.to(socket.room).emit(
            "onlineUsers",
            roomUsers
        );

    });


    // ==============================
    // 4. LEAVE
    // ==============================
    socket.on("leaveChat", () => {
        if (!socket.room) return;

        const room = socket.room;

        socket.to(room).emit(
            "userLeft",
            `${socket.username} left the chat`
        );

        socket.leave(room);
        socket.room = null;
        console.log(
            `${socket.username} left room: ${room}`
        );
    });

    // ==============================
    // 5. MESSAGE
    // ==============================

    socket.on("message", (data) => {

        if (!socket.username || !socket.room) return;

        io.to(socket.room).emit("message", {

            text: data,

            sender: socket.username,

            id: socket.id

        });

    });


    // ==============================
    // 6. TYPING
    // ==============================

    socket.on("typing", () => {

        if (!socket.room || !socket.username) return;

        socket.to(socket.room).emit(
            "typing",
            socket.username
        );

    });


    // ==============================
    // 7. STOP TYPING
    // ==============================

    socket.on("stopTyping", () => {

        if (!socket.room) return;

        socket.to(socket.room).emit(
            "stopTyping"
        );

    });


    // ==============================
    // 8. DISCONNECT
    // ==============================

    socket.on("disconnect", () => {

        if (!socket.username) return;

        console.log(
            `${socket.username} disconnected`
        );

        delete users[socket.id];

        if (socket.room) {

            socket.to(socket.room).emit(
                "userLeft",
                `${socket.username} left the chat`
            );

        }

    });

});


export default server;