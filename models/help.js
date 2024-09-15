const mongoose = require('mongoose')
const User = require('./user')
const helpSchema = new mongoose.Schema({
    message : {type : String, required : true},
    userId : {type : mongoose.Schema.Types.ObjectId, ref:User}
})


module.exports = mongoose.model('Help', helpSchema)