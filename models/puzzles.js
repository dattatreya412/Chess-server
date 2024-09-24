const mongoose = require("mongoose");

const puzzleSchema = new mongoose.Schema({
  puzzles: [
    {
      gameboardPosition: { type: String, unique: true },
      correctMoves: [
        {
          from: String,
          to: String, 
          promotion: String,
        },
      ], 
      turn: String,
      rating: Number,
    },
  ],
});

module.exports = mongoose.model("Puzzles", puzzleSchema);
