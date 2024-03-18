const mongoose = require("mongoose");

const gameDataSchema = new mongoose.Schema({
  room_id: String,

  current_question_ru: String,
  current_question_kz: String,
  question_id: Number,
  points: Number,
  category: String,

  game_step: Number,
  // Добавляем поля для хранения ответов и количества ответивших пользователей
  answers: [{
    user_id: String,
    username: String,
    answer: String
  }],
  answered_count: { type: Number, default: 0 }
});

const GameData = mongoose.model("GameData", gameDataSchema);

module.exports = GameData;
