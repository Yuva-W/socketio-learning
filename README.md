# Socket.IO Learning - Real-Time Chat Application

A simple real-time chat application built while learning **Socket.IO**, **Node.js**, **Express.js**, and **JavaScript**.

The main purpose of this project is to understand how real-time communication works between clients and a server using Socket.IO.

---

## Project Goal

The project is being developed step-by-step to understand Socket.IO concepts practically.

### Current flow

```text
Enter Name
     ↓
Enter Room
     ↓
Join Room
     ↓
Join Chat
     ↓
Start Chatting

## Project Overview

This project is a hands-on implementation of a real-time chat application using Socket.IO.

Instead of using traditional HTTP requests for every message, Socket.IO maintains a real-time connection between the client and server.

This allows users to:

- Send and receive messages instantly
- See users joining and leaving
- See who is online
- See when another user is typing
- Communicate inside specific rooms


### User Flow

```md
## User Flow

```text
┌─────────────────┐
│   Enter Name    │
└────────┬────────┘
         ↓
┌─────────────────┐
│   Enter Room    │
└────────┬────────┘
         ↓
┌─────────────────┐
│    Join Room    │
└────────┬────────┘
         ↓
┌─────────────────┐
│    Join Chat    │
└────────┬────────┘
         ↓
┌─────────────────┐
│ Start Chatting  │
└────────┬────────┘
         ↓
┌─────────────────┐
│ Leave Chat      │
└─────────────────┘


### User Flow

```md
## User Flow

```text
┌─────────────────┐
│   Enter Name    │
└────────┬────────┘
         ↓
┌─────────────────┐
│   Enter Room    │
└────────┬────────┘
         ↓
┌─────────────────┐
│    Join Room    │
└────────┬────────┘
         ↓
┌─────────────────┐
│    Join Chat    │
└────────┬────────┘
         ↓
┌─────────────────┐
│ Start Chatting  │
└────────┬────────┘
         ↓
┌─────────────────┐
│ Leave Chat      │
└─────────────────┘


## Real-Time Message Flow

```text
User types message
       ↓
Click Send / Press Enter
       ↓
socket.emit("message")
       ↓
Socket.IO Server
       ↓
io.to(room).emit("message")
       ↓
All users inside room
       ↓
Message displayed