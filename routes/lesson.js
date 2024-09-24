const express = require('express');
const router = express.Router();
const Lesson = require('../models/lesson');

// GET all lessons
router.get('/', async (req, res) => {
  try {
    const lessons = await Lesson.find();
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a specific lesson by ID
router.get('/:id', getLessonById, (req, res) => {
  res.json(res.lesson);
});

// POST a new lesson
router.post('/', async (req, res) => {
  const lesson = new Lesson({
    lessonImg: req.body.lessonImg,
    lessonTitle: req.body.lessonTitle,
    lessonContent: req.body.lessonContent,
    lessonGuide: req.body.lessonGuide
  });

  try {
    const newLesson = await lesson.save();
    res.status(201).json(newLesson);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Middleware function to get a lesson by ID
async function getLessonById(req, res, next) {
  let lesson;
  try {
    lesson = await Lesson.findById(req.params.id);
    if (lesson == null) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.lesson = lesson;
  next();
}

module.exports = router;
