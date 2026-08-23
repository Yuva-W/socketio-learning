import { Server } from "socket.io"

const initializeSocket = (server) => {
    const io = new Server(server);

    return io;
}

export default initializeSocket;