const chatForm = document.getElementById("chat-form")
const chatMessage = document.querySelector(".chat-messages")

// get username and room from url
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})


const socket = io();

// join chatroom
socket.emit("joinRomm", { username, room })

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