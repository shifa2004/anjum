require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:8080"],
        methods: ["GET", "POST"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"]
    }
});

// --- Centralized Connection State ---
let currentActiveConnection = null; // Stores the active drone-doctor connection

// Serve static files
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

    // Send current active connection to newly connected client
    if (currentActiveConnection) {
        socket.emit('currentConnectionStatus', currentActiveConnection);
    }

    socket.on('join', (room) => {
        socket.join(room);
        console.log(`${socket.id} joined room: ${room}`);
    });

    // --- Handle Connection Updates from Clients ---
    socket.on('updateConnection', (connectionData) => {
        currentActiveConnection = connectionData;
        console.log('Updated active connection:', currentActiveConnection);
        // Broadcast the updated connection status to all connected clients
        io.emit('currentConnectionStatus', currentActiveConnection);
    });

    // --- Handle Connection Reset from Clients ---
    socket.on('resetConnection', () => {
        currentActiveConnection = null;
        console.log('Connection reset by a client.');
        // Broadcast the reset status to all connected clients
        io.emit('currentConnectionStatus', null);
    });

    // --- GPS Data Sync ---
    socket.on('updateDroneData', (data) => {
        socket.to('108').emit('droneData', data);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        // Optional: If you want to clear the connection if the last user disconnects
        // This logic can be more complex depending on how you define "active" connections
        // For simplicity, we'll keep the last set connection until explicitly reset.
    });
});

const PORT = process.env.PORT || 8003;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Drone interface: http://localhost:${PORT}/drone.html`);
    console.log(`Doctor interface: http://localhost:${PORT}/doctor.html`);
});
