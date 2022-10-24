const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

//Iniciar el servidor
const port = 2000;
const server = app.listen(port);
console.log(`Server listen on port ${port}`);


app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});


require('./routes/Users.routes')(app);
require("./routes/Videos.routes")(app);


//Web Sockets
const socketIO = require('socket.io');
const io = socketIO(server);

io.on('connection', (socket) => {
    console.log("Nueva conexion", socket.id);

    socket.on('video:tiempo', (data) => {
        
    })

    // socket.on('chat:message', (data) => {
    //     io.sockets.emit('chat:message', data);      //Emite a todos los clientes
    // });

    // socket.on('chat:typing', (data) => {
    //     socket.broadcast.emit('chat:typing', data);       //Emite a todos menos a si mismo
    // });
});

