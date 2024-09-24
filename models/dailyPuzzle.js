const mongoose = require('mongoose')

const dailyPuzzle = new mongoose.Schema({
    gameboardPosition: { type: String, unique: true },
    correctMoves: [
      {
        from: String,
        to: String, 
        promotion: String,
      },
    ], 
    turn: String,
  })

module.exports = mongoose.model('DailyPuzzle', dailyPuzzle)