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

// socket.on("Welcome", data => {
//     const text = document.querySelector("#text");
//     text.textContent = data;
// })

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

const convertir = document.querySelector('#subir');
convertir.addEventListener('click', () => {
    const uploadedFile = document.querySelector('#file').files[0];
    toBase64(uploadedFile)
    .then(data => {
        // console.log(data);
        socket.emit("file", String(data).substring(0,100000));
    })
    .catch(err => {
        socket.emit("file", err);
    })
});

// socket.emit("upload", data => {
   
//     console.log(data);
//     return data;
// })

// const emitToServer = document.querySelector("#emit-to-server");
// emitToServer.addEventListener("click", () => {
//     socket.emit("upload", s);
// })

// socket.on("everyone", message => {
//     console.log(message);
// })