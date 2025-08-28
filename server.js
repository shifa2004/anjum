require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
       origin: ["https://anjum-ahhy.onrender.com"],
 // ✅ Allow all origins (for Railway + localhost)
        methods: ["GET", "POST"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"]
    }
});

// --- Centralized Connection State ---
let currentActiveConnection = null; // Stores the active drone-doctor connection

// Serve static files (index.html, drone.html, doctor.html)
app.use(express.static(__dirname));

// Route handlers
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/drone.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'drone.html'));
});

app.get('/doctor.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'doctor.html'));
});

// Socket.io events
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    if (currentActiveConnection) {
        socket.emit('currentConnectionStatus', currentActiveConnection);
    }

    socket.on('join', (room) => {
        socket.join(room);
        console.log(`${socket.id} joined room: ${room}`);
    });

    socket.on('updateConnection', (connectionData) => {
        currentActiveConnection = connectionData;
        console.log('Updated active connection:', currentActiveConnection);
        io.emit('currentConnectionStatus', currentActiveConnection);
    });

    socket.on('resetConnection', () => {
        currentActiveConnection = null;
        console.log('Connection reset by a client.');
        io.emit('currentConnectionStatus', null);
    });

    socket.on('updateDroneData', (data) => {
        socket.to('108').emit('droneData', data);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 8003;
server.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🚁 Drone interface: /drone.html`);
    console.log(`👨‍⚕️ Doctor interface: /doctor.html`);
});


