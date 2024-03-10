const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  category: String,
  questions:  [{
    id: Number,
    question_ru: String,
    question_kz: String,
    points: Number,
    correct_answer_ru: String,
    correct_answer_kz: String,
    answered: Boolean
  }]
});

const Question = mongoose.model('Questions', questionSchema);

module.exports = Question;
