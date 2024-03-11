const mongoose = require('mongoose');

const gameDataSchema = new mongoose.Schema({
  room_id: String,
  gameData: {
    current_question_ru: String,
    current_question_kz: String,
    question_id: Number,
    game_step: Number
  }
});

const GameData = mongoose.model('GameData', gameDataSchema);

module.exports = GameData;
