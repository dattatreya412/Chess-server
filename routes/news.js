// const express = require("express");
// const News = require("../models/news");

// const router = express.Router();

// router.post("/addNews", async (req, res) => {
//   try {
//     const { highlights, news } = req.body;
//     const newNews = new News({
//       highlights: highlights,   
//       news: news,
//     });
//     console.log(newNews);
//     await newNews.save();
//     res.status(201).json({
//       sucessful: true,
//       message: "news added",
//       newNews
//     });
//   } catch (err) {
//     res.status(500).json({
//       sucessful: false,
//       message: "unable to add news",
//       erormessage: err,
//     });
//   }
// });
// router.get("/getNews", async (req, res) => {
//   try {
//     const data = await News.findOne();
//     console.log(data);
//     res.status(201).json(data);
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: "News not avilable",
//       error: err,
//     });
//   }
// });


// module.exports = router;




const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const News = require('../models/news'); 1
const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the upload folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Create a unique filename
  },
});

const upload = multer({ storage }); 

// Route to handle highlight submission
router.post('/api/highlights', upload.single('highlightImg'), async (req, res) => {
  try {
    const { highlightTitle } = req.body;
    const highlightImg = req.file.path; // Get the image path

    // Create a new document with highlights
    const news = new News({
      highlights: {
        img: highlightImg,
        title: highlightTitle,
      },
    });

    await news.save();
    res.status(200).json({ message: 'Highlight saved successfully', news });
  } catch (error) {
    console.error('Error saving highlight:', error);
    res.status(500).json({ message: 'Failed to save highlight', error });
  }
});

module.exports = router