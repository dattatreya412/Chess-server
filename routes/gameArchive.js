const express = require('express')
const GameArchive = require('../models/gameArchive')
const router = express.Router()

router.post('/addGame',async(req, res)=>{
    try{
        const {whitePlayerId, blackPlayerId} = req.body
        const newGameArchive = new GameArchive({
            whitePlayerId,
            blackPlayerId,
        })
        const response = await newGameArchive.save()
        console.log(response._id)
        res.status(200).json({
            success : true,
            message : "successfully aded the game to your archive",
            response
        })
    }catch(err){
        res.status(500).json({
            sucess : false,
            message : "error occoured while adding game.",
            error : err
        })
    }
})

module.exports = router