const express = require("express");
const Puzzles = require("../models/puzzles"); // Import the Puzzles model

const router = express.Router();

// Route to add a new puzzle
router.post("/", async (req, res) => {
  try {
    const puzzle = req.body;
    const existingPuzzle = await Puzzles.findOne({
      "puzzles.gameboardPosition": puzzle.gameboardPosition,
    });

    if (existingPuzzle) {
      return res.status(400).json({
        success: false,
        message: "A puzzle with this gameboard position already exists.",
      });
    }

    // Add the new puzzle to the puzzles array
    await Puzzles.updateOne(
      {},
      { $push: { puzzles: puzzle } },
      { upsert: true } // Create a new document if it doesn't exist
    );

    res.status(201).json({
      success: true,
      message: "Puzzle added successfully.",
    });
  } catch (err) {
    console.error("Error adding puzzle:", err);
    res.status(500).json({
      success: false,
      message: "Unable to add puzzle.",
      error: err.message,
    });
  }
});

// Route to get all puzzles
router.get("/", async (req, res) => {
  try {
    const puzzles = await Puzzles.find({});
    res.status(200).json({
      success: true,
      puzzles,
    });
  } catch (err) {
    console.error("Error fetching puzzles:", err);
    res.status(500).json({
      success: false,
      message: "Unable to fetch puzzles.",
      error: err.message,
    });
  }
});

module.exports = router;
