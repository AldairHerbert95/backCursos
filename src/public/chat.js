// const socket = io();


// //DOM elements
// let message = document.getElementById('message');
// let username = document.getElementById('username');
// let btn = document.getElementById('send');
// let output = document.getElementById('output');
// let actions = document.getElementById('actions');

// btn.addEventListener('click', function(){
//     socket.emit('chat:message', {
//         message: message.value,
//         username: username.value
//     });
// });

// message.addEventListener('keypress', function() {
//     socket.emit('chat:typing', username.value);
// })

// socket.on('chat:message', function (data){
//     console.log(data);
//     actions.innerHTML = '';
//     output.innerHTML += `<p>
//      <strong>${data.username}</strong>: ${data.message}
//     </p>`;
// });

// socket.on('chat:typing', function (data){
//     actions.innerHTML = `<p><em>${data} is typing a message..</em></p>`
// })






const socket = io();

socket.on("Welcome", data => {
    const text = document.querySelector("#text");
    text.textContent = data;
})

const emitToServer = document.querySelector("#emit-to-server");
emitToServer.addEventListener("click", () => {
    socket.emit("server", "Hola, servidor :)");
})

socket.on("everyone", message => {
    console.log(message);
})