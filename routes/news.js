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

// Serve static files from the 'uploads' directory
router.use('/news/uploads', express.static(path.join(__dirname, '..', 'uploads')));

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
      news : []
    });

    await news.save();
    res.status(200).json({ message: 'Highlight saved successfully', news });
  } catch (error) {
    console.error('Error saving highlight:', error);
    res.status(500).json({ message: 'Failed to save highlight', error });
  }
});

// New route to get the image and title of highlights
router.get('/api/highlights', async (req, res) => {
  try {
    const latestNews = await News.findOne().sort({ createdAt: -1 });
    
    if (!latestNews || !latestNews.highlights) {
      return res.status(404).json({ message: 'No highlights found' });
    }

    const { img, title } = latestNews.highlights;
    res.status(200).json({ img, title });
  } catch (error) {
    console.error('Error fetching highlights:', error);
    res.status(500).json({ message: 'Failed to fetch highlights', error });
  }
});

// New route to update the existing news item
router.put('/api/news', upload.single('img'), async (req, res) => {
  try {
    // console.log("Received request body:", req.body);
    // console.log("Received file:", req.file);

    const { title, description } = req.body;
    let imgPath = null;

    if (req.file) {
      imgPath = req.file.path;
    }

    const updateData = {
      'news.0.title': title,
      'news.0.description': description,
      'news.0.date': new Date()
    };

    if (imgPath) {
      updateData['news.0.img'] = imgPath;
    }

    const updatedNews = await News.findOneAndUpdate(
      {}, // Match all documents
      {
        $push: {
          news: {
            $each: [{
              img: updateData['news.0.img'],
              title: updateData['news.0.title'],
              date: updateData['news.0.date'],
              description: updateData['news.0.description']
            }],
            $position: 0
          }
        }
      },
      { new: true, upsert: true }
    );

    if (!updatedNews || !updatedNews.news || updatedNews.news.length === 0) {
      return res.status(404).json({ message: 'Failed to update news item' });
    }

    res.status(200).json({ message: 'News item updated successfully', updatedNews });
  } catch (error) {
    console.error('Error updating news item:', error);
    res.status(500).json({ message: 'Failed to update news item', error: error.message });
  }
});

// New route to get the news array
router.get('/api/news', async (req, res) => {
  try {
    const latestNews = await News.findOne().sort({ createdAt: -1 });
    
    if (!latestNews || !latestNews.news) {
      return res.status(404).json({ message: 'No news found' });
    }

    // Modify the image paths in the news array
    const modifiedNews = latestNews.news.map(item => ({
      ...item,
      img: item.img ? `/news/uploads/${path.basename(item.img)}` : null
    }));

    res.status(200).json({ news: modifiedNews });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ message: 'Failed to fetch news', error: error.message });
  }
});

module.exports = router;