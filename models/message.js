const mongoose = require("mongoose");
const User = require('../models/user')
const messageSchema = new mongoose.Schema({
    sentBy: String,
    sentTo : String, 
    message: String,
    noticed : {type : Boolean , default : false},
    viewed : {type : Boolean , default : false}
});

module.exports = mongoose.model("Message", messageSchema);
