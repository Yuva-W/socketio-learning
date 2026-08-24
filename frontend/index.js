const socket = io();

let roomJoined = false;
let joined = false;
let typingTimer;

// ELEMENTS
const username = document.getElementById("username");
const room = document.getElementById("room");
const joinRoom = document.getElementById("joinRoom");
const join = document.getElementById("join");
const leave = document.getElementById("leave");
const input = document.getElementById("input");
const btn = document.getElementById("send");
const msg = document.getElementById("message");
const onlineUsers = document.getElementById("onlineUsers");
const typing = document.getElementById("typing");

// INITIAL STATE
username.disabled = false;
room.disabled = false;
joinRoom.disabled = false;
join.disabled = true;
leave.disabled = true;
input.disabled = true;
btn.disabled = true;

// ENTER NAME + JOIN ROOM
joinRoom.addEventListener("click", () => {
    const name = username.value.trim();
    const roomName = room.value.trim();

    if (!name) {
        alert("Enter your name");
        return;
    }

    if (!roomName) {
        alert("Enter room name");
        return;
    }

    socket.emit("join", name);
    socket.emit("joinRoom", roomName);
});

// ROOM JOINED
socket.on("roomJoined", (roomName) => {
    console.log(`Joined room: ${roomName}`);

    roomJoined = true;

    username.disabled = true;
    room.disabled = true;
    joinRoom.disabled = true;

    join.disabled = false;
});

// JOIN CHAT
join.addEventListener("click", () => {
    if (!roomJoined) return;

    socket.emit("joinChat");

    joined = true;

    join.disabled = true;
    leave.disabled = false;
    input.disabled = false;
    btn.disabled = false;

    input.focus();
});

// Leave CHAT
leave.addEventListener("click", () => {
    if (!joined) return;

    socket.emit("leaveChat");

    joined = false;
    leave.disabled = true;
    input.disabled = true;
    btn.disabled = true;

    input.value = "";
});

// SEND MESSAGE
const sendMessage = () => {
    if (!joined) return;

    const value = input.value.trim();

    if (value === "") return;

    socket.emit("message", value);

    clearTimeout(typingTimer);
    socket.emit("stopTyping");

    input.value = "";
    input.focus();
};

// Enter key
input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        sendMessage();
    }
});

// Send button
btn.addEventListener("click", () => {
    sendMessage();
});

// MESSAGE
socket.on("message", (data) => {
    const h = document.createElement("h5");

    h.textContent = data.text;

    if (data.id === socket.id) {
        h.classList.add("my-message");
    } else {
        h.classList.add("other-message");
    }

    msg.appendChild(h);

    // Auto scroll
    const chat = document.querySelector(".main");
    chat.scrollTop = chat.scrollHeight;
});

// USER JOINED
socket.on("userJoined", (message) => {
    const h = document.createElement("h5");

    h.textContent = message;
    msg.appendChild(h);
});

// USER JOINED ROOM
socket.on("userJoinedRoom", (message) => {
    const h = document.createElement("h5");

    h.textContent = message;
    msg.appendChild(h);
});

// USER LEFT
socket.on("userLeft", (message) => {
    const h = document.createElement("h5");

    h.textContent = message;
    msg.appendChild(h);
});

// ONLINE USERS
socket.on("onlineUsers", (users) => {
    onlineUsers.innerHTML = "";

    users.forEach((username) => {
        const li = document.createElement("li");

        li.textContent = username;
        onlineUsers.appendChild(li);
    });
});

// TYPING
input.addEventListener("input", () => {
    if (!joined) return;

    socket.emit("typing");

    clearTimeout(typingTimer);

    typingTimer = setTimeout(() => {
        socket.emit("stopTyping");
    }, 1000);
});

// Someone typing
socket.on("typing", (username) => {
    typing.textContent = `${username} is typing...`;
});

// Stop typing
socket.on("stopTyping", () => {
    typing.textContent = "";
});