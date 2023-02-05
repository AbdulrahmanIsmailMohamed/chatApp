const chatForm = document.getElementById("chat-form")
const chatMessage = document.querySelector(".chat-messages")
const roomName = document.getElementById("room-name")
const userList = document.getElementById("users")

// get username and room from url
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})


const socket = io();

// join chatroom
socket.emit("joinRoom", { username, room })

// add users and room to chat
socket.on("roomUsers", ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
})


// message from server
socket.on("message", message => {
    console.log(message);
    outputMessage(message)

    // scroll down
    chatMessage.scrollTop = chatMessage.scrollHeight;
});

// message submit
chatForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // get message text 
    const msg = e.target.elements.msg.value;
    console.log(msg);
    // emit message to server
    socket.emit("chatMessage", msg)

    // clear input
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();
});

// output message to dom
function outputMessage(message) {
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `<p class="meta">${message.user} <span> ${message.time} </span></p>
    <p class="text">
        ${message.text}
    </p>`
    document.querySelector(".chat-messages").appendChild(div)
}

function outputRoomName(room) {
    roomName.innerText = room
}

function outputUsers(users) {
    userList.innerHTML = `
    ${users.map((user) => `<li>${user.username}</li>`).join("")}
    `;
}