const mongoose = require("mongoose");
const User = require("../models/user");

const gameArchiveSchema = new mongoose.Schema({
  isLive : Boolean,
  whitePlayerId: {type : mongoose.Schema.Types.ObjectId, ref : User, required : true},
  blackPlayerId: {type : mongoose.Schema.Types.ObjectId, ref : User, required : true},
  spectatorId : {type : String , required : true},
  moves: [
    {
      from: String,
      to: String,
      promotion: String,
    },
  ], 
  winner : String
});

module.exports = mongoose.model("GameArchive", gameArchiveSchema);
