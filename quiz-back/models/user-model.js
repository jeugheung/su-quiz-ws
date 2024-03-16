const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  room_id: String,
  user_id: String,
  username: String,
  points: Number
});

const User = mongoose.model('User', userSchema);

module.exports = User;
