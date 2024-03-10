const express = require('express');
const ws = require('ws');
const cors = require('cors');
const mongoose = require('mongoose');
const Question = require('./models/question-model');
const User = require('./models/user-model')

const app = express();

app.use(cors());
app.use(express.json());

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

const mongoUrl = "mongodb+srv://akartdev:myway25@cluster0.e4o2kx9.mongodb.net/quiz?retryWrites=true&w=majority"

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

app.get('/questions', async (req, res) => {
  try {
    const questions = await Question.find();
    console.log(questions)
  
    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// app.get('/users', async (req, res) => {
//   try {
//     // Находим всех пользователей
//     const users = await User.find();
//     console.log('users')
//     res.json(users); // Отправляем найденных пользователей в формате JSON
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

app.post('/users', async (req, res) => {
  try {
    // Создание нового пользователя на основе данных из тела запроса
    const newUser = new User({
      username: req.body.username,
      points: req.body.points,
      room_id: req.body.room_id
    });

    // Сохранение пользователя в базу данных
    const savedUser = await newUser.save();

    res.status(201).json(savedUser); // Отправляем созданного пользователя обратно в ответе
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
