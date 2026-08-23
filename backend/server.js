import server from "./app.js";

const port = 8000;

server.listen(port, () => {
    console.log("app is listing at :",port);
});