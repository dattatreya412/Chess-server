const mongoose = require('mongoose')
const User = require('../models/user')

const connectFriendSchema = new mongoose.Schema({
    status : {type : String, required : true},
    sentBy : {type : mongoose.Schema.Types.ObjectId, ref : User},
    sentTo : {type :mongoose.Schema.Types.ObjectId, ref :User}
})

module.exports = mongoose.model('ConnectFriend', connectFriendSchema)