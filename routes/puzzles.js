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

// // Route to get all puzzles
// router.get("/", async (req, res) => {
//   try {
//     const puzzles = await Puzzles.find({});
//     res.status(200).json({
//       success: true,
//       puzzles,
//     });
//   } catch (err) {
//     console.error("Error fetching puzzles:", err);
//     res.status(500).json({
//       success: false,
//       message: "Unable to fetch puzzles.",
//       error: err.message,
//     });
//   }
// });

// router.get("/", async (req, res) => {
//   try {
//     let puzzles = await Puzzles.find({});
    
//     // Shuffle the puzzles inside each puzzle document
//     puzzles = puzzles.map(puzzle => {
//       puzzle.puzzles = puzzle.puzzles.sort(() => Math.random() - 0.5);
//       return puzzle;
//     });

//     res.status(200).json({
//       success: true,
//       puzzles,
//     });
//   } catch (err) {
//     console.error("Error fetching puzzles:", err);
//     res.status(500).json({
//       success: false,
//       message: "Unable to fetch puzzles.",
//       error: err.message,
//     });
//   }
// });



// Fisher-Yates Shuffle (ensuring no dependencies on `turn` or `rating`)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

router.get("/", async (req, res) => {
  try {
    let puzzles = await Puzzles.find({});
    
    // Shuffle only the puzzles, ignoring `turn` or `rating`
    puzzles = puzzles.map(puzzle => {
      puzzle.puzzles = shuffleArray(puzzle.puzzles);
      return puzzle;
    });

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
