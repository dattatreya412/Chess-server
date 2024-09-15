const mongoose = require("mongoose");
const Friends = require('../models/friends')
const Notes = require('../models/notes')

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  country: String, 
  bio: String,  
  isLive: { type: Boolean, default: false },
  isPlaying : {type : Boolean, default : false},
  gameID : {type : String},
  playedGames: [{ type: mongoose.Schema.Types.ObjectId, ref: "GameArchive" }],
  playerMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  playerNotes: { type: mongoose.Schema.Types.ObjectId, ref: Notes },
  // playerFriends: { type: mongoose.Schema.Types.ObjectId, ref: Friends },
});

module.exports = mongoose.model("User", userSchema);
