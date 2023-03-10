const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketio(server);

const formatMessage = require("./util/messages");
const {
    getCurrentUser,
    userJoin,
    getRoomUsers,
    userLeave
} = require("./util/user");

// Set static folder
app.use(express.static("public"))

const botName = "ChatCard Bot";

io.on("connection", (socket) => {
    socket.on("joinRoom", ({ username, room }) => {
        let user = userJoin(socket.id, username, room);
        socket.join(user.room)

        // welcom
        socket.emit("message", formatMessage(botName, "Welcom to chat card !!"));

        // Broadcast when a user connects
        socket.broadcast.to(user.room).emit("message", formatMessage(botName, `${user.username} has joined the chat!!`))

        // send a username and room to client
        io.to(user.room).emit("roomUsers",{
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    // chat messages
    socket.on("chatMessage", (msg) => {
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit("message", formatMessage(user.username, msg));
    });

    // run when client disconnect
    socket.on("disconnect", () => {
        const user = userLeave(socket.id)
        if (user) {
            io.to(user.room)
                .emit(
                    "message",
                    formatMessage(botName, `${user.username} has left the chat`)
                );
        }
    });

})


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`The Server Running On Port ${PORT}`));