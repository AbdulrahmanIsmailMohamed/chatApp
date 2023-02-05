const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const app = express();
const server = http.createServer(app)
const io = socketio(server)
const formatMessage = require("./util/messages");
const { getCurrentUser, userJoin } = require("./util/user");

// Set static folder
app.use(express.static("public"))

const botName = "ChatCard Bot";

io.on("connection", socket => {
    socket.on("joinRoom", ({ username, room }) => {
        let users = userJoin(socket, username, room)

        socket.join(users.room)

        // welcom
        socket.emit("message", formatMessage(botName, "Welcom to chat card !!"));

        // broadcast when a user connected
        socket.broadcast.to(users.room).emit("message", formatMessage(botName, `${user.username}  has joined the chat`));
    });

    // listen for a new message
    socket.broadcast
        .to(user.room)
        .emit(
            "message",
            formatMessage(botName, `${user} has joined the chat`)
        );

    // run when client disconnect
    socket.on("disconnect", () => {
        io.emit("message", formatMessage(botName, "A user has left the chat"))
    });
})


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`The Server Running On Port ${PORT}`));