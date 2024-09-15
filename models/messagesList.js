const mongoose = require('mongoose');
const User = require('./user'); // Ensure the path to the User model is correct
const Message = require('./message'); // Ensure the path to the Message model is correct

// Define the MessagesList schema
const messageListSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,  
    required: true,
  },
  messagesList: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User, 
        required: true,
      },
      messagesId: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: Message, 
        },
      ],
    },
  ],
});

// Export the MessagesList model
module.exports = mongoose.model('MessagesList', messageListSchema);
