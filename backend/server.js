const express = require('express');
const axios = require('axios');
const app = express();
const http = require('http');
const path = require('path');
const cors = require('cors')

const { Server } = require('socket.io');
const ACTIONS = require('../src/Action');
const { stdin } = require('process');

app.use(express.json()); // To parse JSON body
app.use(cors()) // Use this after the variable declaration


const JDoodleConfig = {
  clientId: 'ab2f3dfc4e7abb3c017001187af5217c',  // Replace with your JDoodle clientId
  clientSecret: '58c892bde354b720a0f427bbb691280b8b5fb22125f296fd7ce94a579b8a3a3f',  // Replace with your JDoodle clientSecret
};

// API route to execute the code
app.post('/api/execute', async (req, res) => {
  const { script, language, versionIndex,stdin } = req.body;
    try {
    const response = await axios.post('https://api.jdoodle.com/v1/execute', {
      clientId: JDoodleConfig.clientId,
      clientSecret: JDoodleConfig.clientSecret,
      stdin,
      script,
      language,
      versionIndex,
    });
    // console.log(response.data);
    res.json(response.data);
  } catch (error) {
    console.error('JDoodle API Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Code execution failed.' });
  }
});

// Socket.io configuration (unchanged)
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const userSocketMap = {};
function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => ({
      socketId,
      username: userSocketMap[socketId],
    })
  );
}

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);

  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on('disconnecting', () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
    socket.leave();
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
