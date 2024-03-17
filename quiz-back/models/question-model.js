const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  category: String,
  id: Number,
  question_ru: String,
  question_kz: String,
  points: Number,
  answered: Boolean,
});

const Question = mongoose.model("Questions", questionSchema);

module.exports = Question;
