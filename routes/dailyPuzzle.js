const express = require('express')
const router = express.Router()
const DailyPuzzle = require('../models/dailyPuzzle')

router.post('/addPuzzle', async (req, res) => {
    try {
        const { gameboardPosition, correctMoves, turn } = req.body
        const dailyPuzzle = new DailyPuzzle({ gameboardPosition, correctMoves, turn })
        await dailyPuzzle.save()
        res.json(dailyPuzzle)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/getPuzzle', async (req, res) => {
    try {
        const dailyPuzzle = await DailyPuzzle.findOne()
        if (!dailyPuzzle) {
            return res.status(404).json({ message: 'No daily puzzle found' })
        }
        res.json(dailyPuzzle)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.delete('/deletePuzzle', async (req, res) => {
    try {
        await DailyPuzzle.deleteOne()
        res.json({ message: 'Daily puzzle deleted' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports = router