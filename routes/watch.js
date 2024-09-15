const express = require('express')

const router = express.Router()
const GameArchive = require('../models/gameArchive')


router.get('/',async(req, res)=>{
    try{
        const liveGames = await GameArchive.find({isLive : true})
        res.status(200).json({
            success : true,
            message : 'fetched the live games successfully.',
            liveGames
        })
    }catch(err){
        res.status(500).json({
            success : false,
            message : 'unable to fetch live users',
            error : err
        })
    }
    
})


module.exports = router