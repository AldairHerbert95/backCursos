const socketIO = require('socket.io');
const io = socketIO(server);

io.on('connection', (socket) => {
    console.log('Clientes conectados', io.engine.clientCount);
    console.log("Nueva Coexion", socket.id);
});
