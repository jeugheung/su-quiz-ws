const express = require('express');
const ws = require('ws');
const cors = require('cors');
const mongoose = require('mongoose');
const Question = require('./models/question-model');
const User = require('./models/user-model');
const GameData = require('./models/game-model');

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
    // Проверяем, существует ли пользователь с данным room_id
    const existingUser = await User.findOne({ room_id: req.body.room_id });

    if (existingUser) {
      // Если пользователь существует, добавляем нового пользователя в массив userData
      existingUser.userData.push({
        username: req.body.username,
        points: req.body.points,
        user_id: req.body.id
      });

      // Сохраняем обновленного пользователя
      const savedUser = await existingUser.save();
      res.status(201).json(savedUser);
    } else {
      // Если пользователь не существует, создаем нового пользователя
      const newUser = new User({
        room_id: req.body.room_id,
        userData: [{
          username: req.body.username,
          points: req.body.points,
          user_id: req.body.id
        }]
      });

      // Сохраняем нового пользователя в базу данных
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/users/:room_id', async (req, res) => {
  try {
    const users = await User.findOne({ room_id: req.params.room_id });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/user/:userId', async (req, res) => {
  try {
    // Извлекаем id пользователя из параметра запроса
    const userId = req.params.userId;

    // Находим пользователя по его id
    const user = await User.findOne({ 'userData': { $elemMatch: { user_id: userId } } });

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Возвращаем найденного пользователя в ответе
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/games', async (req, res) => {
  try {
    const { room_id, gameData } = req.body;
    let existingGameData = await GameData.findOne({ room_id });

    if (!existingGameData) {
      // Если данных для данной комнаты еще нет, создаем новую запись
      existingGameData = new GameData({ room_id, gameData });
    } else {
      // Если данные уже существуют, обновляем их
      existingGameData.gameData = gameData;
    }

    const savedGameData = await existingGameData.save();
    res.status(201).json(savedGameData);
  } catch (error) {
    console.error('Error creating or updating game data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/games/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    const gameData = await GameData.findOne({ room_id: roomId });
    if (!gameData) {
      return res.status(404).json({ message: 'Game data not found' });
    }
    res.json(gameData);
  } catch (error) {
    console.error('Error fetching game data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



