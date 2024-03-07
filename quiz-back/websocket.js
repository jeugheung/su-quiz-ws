const express = require('express');
const ws = require('ws')
const mongoose = require('mongoose');

const app = express();

const server = app.listen(5002, () => {
  console.log('Express server started on port 5002');
});

const wss = new ws.Server({
  noServer: true, // Указываем, что WebSocket-сервер не должен создавать собственный HTTP-сервер
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

// const wss = new ws.Server({
//   port: 5002,
// }, () => console.log('Server WSS started at 5002'))

const mongoUrl = "mongodb+srv://akartdev:myway25@cluster0.e4o2kx9.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(mongoUrl)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.log('MongoDB connection error:', error));

wss.on('connection', function connection(ws) {
  ws.on('message', function(message) {
    message = JSON.parse(message)
    switch (message.event) {
      case 'message': 
        broadcastMessage(message)
        break;
      case 'start_game': 
        broadcastMessage(message)
        break;
      case 'user_answer':
        broadcastMessage(message)
        break;
      case 'connection':
        broadcastMessage(message)
        break;
    }
  })
})

function broadcastMessage(message) {
  wss.clients.forEach(client => {
    client.send(JSON.stringify(message))
  })
}