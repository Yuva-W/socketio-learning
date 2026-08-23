const socket = io();

const myId = socket.id;

const btn = document.getElementById("send");
const input = document.getElementById("input");
const msg = document.getElementById("message");

const username = document.getElementById("username");
const join = document.getElementById("join");

const onlineUsers = documet.getElementById("onlineUsers");

join.addEventListener("click", () => {
    const name = username.value.trim();

    if (!name) return;

    socket.emit("join", name);

    username.disabled = true;
    join.disabled = true;
})

const sendMessage = () => {
    const value = input.value.trim();

    if(value == "") return;

    socket.emit("message", value);
    input.value = "";
}

input.addEventListener("keypress" , (e) => {
    if (e.key == "Enter"){
        sendMessage();
    }
});

btn.addEventListener("click" , () => {
    sendMessage();
});

socket.on("userJoined", (message) => {
    const h = document.createElement("h5");
    h.textContent = message;

    msg.appendChild(h);
})

socket.on("message", (data) => {
    const h = document.createElement("h5");
    h.textContent = data.text;

    data.id == socket.id ? h.classList.add("my-message") : h.classList.add("other-message");

    msg.appendChild(h);

    const chat = document.querySelector(".main");
    chat.scrollTop = chat.scrollHeight;
});

socket.on("userLeft", (message) => {
    const h = document.createElement("h5");
    h.textContent = message;
    
    msg.appendChild(h);
});

socket.on("onlineUsers", (users) => {
    onlineUsers.innerHtml = "";

    users.forEach(username => {
        const li = document.createElement("li");
        li.textContent = `● ${username}`;

        onlineUsers.appendChild(li);
    });
})
