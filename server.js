const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const app = express();
const server = http.createServer(app)
const io = socketio(server)

// Set static folder
app.use(express.static("public"))

io.on("connection", socket => {
    socket.emit("message", "Welcom to chat card !!");
    socket.broadcast.emit("message", "the user has joined the chat");
    socket.on("disconnect", () => {
        io.emit("message","A user has left the chat")
    })
})


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`The Server Running On Port ${PORT}`));