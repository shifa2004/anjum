const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "https://anjum.up.railway.app",
        methods: ["GET", "POST"],
        credentials: true,
    }
});

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/drone.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'drone.html'));
});

app.get('/doctor.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'doctor.html'));
});

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

let currentActiveConnection = null;

io.on('connection', (socket) => {
    console.log(`User  connected: ${socket.id}`);

    if (currentActiveConnection) {
        socket.emit('currentConnectionStatus', currentActiveConnection);
    }

    socket.on('join', (room) => {
        socket.join(room);
        console.log(`${socket.id} joined room: ${room}`);
    });

    socket.on('updateConnection', (connectionData) => {
        currentActiveConnection = connectionData;
        io.emit('currentConnectionStatus', currentActiveConnection);
    });

    socket.on('resetConnection', () => {
        currentActiveConnection = null;
        io.emit('currentConnectionStatus', null);
    });

    socket.on('updateDroneData', (data) => {
        socket.to('108').emit('droneData', data);
    });

    socket.on('disconnect', () => {
        console.log(`User  disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 8003;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    console.log(`Access your application at: https://anjum.up.railway.app`);
    console.log(`Drone interface: https://anjum.up.railway.app/drone.html`);
    console.log(`Doctor interface: https://anjum.up.railway.app/doctor.html`);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
