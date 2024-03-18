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
      case 'end_step':
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

app.post('/users', async (req, res) => {
  try {
    const newUser = new User({
      room_id: req.body.room_id,
      username: req.body.username,
      points: req.body.points,
      user_id: req.body.id
    });

    // Сохраняем нового пользователя в базе данных
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.get('/users/:room_id', async (req, res) => {
  try {
    const users = await User.find({ room_id: req.params.room_id });
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
    const user = await User.findOne({user_id: req.params.userId});

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
      existingGameData = new GameData({ 
        room_id,
        current_question_ru: gameData.current_question_ru,
        current_question_kz: gameData.current_question_kz,
        question_id: gameData.question_id,
        points: gameData.points,
        category: gameData.category,
        game_step: 0,
        answers: [],
        answered_count: 0
      });
    } else {
      // Если данные уже существуют, обновляем их
      existingGameData.current_question_ru = gameData.current_question_ru;
      existingGameData.current_question_kz = gameData.current_question_kz;
      existingGameData.question_id = gameData.question_id;
      existingGameData.game_step = gameData.game_step;
      existingGameData.points = gameData.points;
      existingGameData.category = gameData.category;
      existingGameData.answers = gameData.answers;
      existingGameData.answered_count = gameData.answered_count;
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


// Маршрут для обработки ответов пользователей
app.post('/answer', async (req, res) => {
  const { room_id, user_id, answer, username } = req.body;

  try {
    // Находим текущее состояние игры по room_id
    const gameData = await GameData.findOne({ room_id });

    if (!gameData) {
      return res.status(404).json({ message: "Игра не найдена" });
    }

    // Проверяем, что пользователь еще не ответил на этот вопрос
    const isAnswered = gameData.answers.some(a => a.user_id === user_id && a.answer === answer);
    if (isAnswered) {
      return res.status(400).json({ message: "Вы уже ответили на этот вопрос" });
    }

    // Добавляем ответ пользователя к текущему состоянию игры
    gameData.answers.push({ user_id, answer, username });
    gameData.answered_count += 1;

    // Если уже ответили три пользователя, можем сделать что-то дальше
    if (gameData.answered_count > 3) {
      return res.status(400).json({ message: "Достигнуто максимальное количество ответов" });
      // Ваша логика для обработки первых трех ответов
      // Например, отправка уведомления о том, что ответили три пользователя
    }

    // Сохраняем обновленное состояние игры
    await gameData.save();

    res.status(200).json({ message: "Ответ принят" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});




app.post('/updatePoints', async (req, res) => {
  const { user_id, points } = req.body;

  try {
    // Находим пользователя по user_id
    const user = await User.findOne({ user_id });

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Обновляем количество баллов пользователя
    user.points += points;

    // Сохраняем обновленного пользователя
    const updatedUser = await user.save();

    res.status(200).json({ message: 'Количество баллов пользователя обновлено', user: updatedUser });
  } catch (error) {
    console.error('Ошибка при обновлении баллов пользователя:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});





