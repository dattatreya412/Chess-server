
const express = require("express");
const Message = require("../models/message");
const MessagesList = require('../models/messagesList');
const user = require("../models/user");
const message = require("../models/message");

const router = express.Router(); 

router.post("/sendMessage", async (req, res) => {
  try {
    const {
      sentBy,
      sentTo,
      message
    } = req.body;

    const newMessage = new Message({
      sentBy,
      sentTo,
      message
    })
    await newMessage.save();
    const userId = await user.findOne({username : sentBy})
    const toUserId = await user.findOne({username : sentTo})
    console.log(userId + " " + toUserId + " " + newMessage._id)
    addMessages(userId, toUserId, newMessage._id)
    addMessages(toUserId , userId, newMessage._id)
    res.status(201).json({
      success: true,
      message: "message sent successfully",
      data: newMessage,
    });
  } catch (err) {
    console.error("Error unable to send message:", err); // Log the error for debugging
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message, // Include the error message in the response
    });
  }
});



router.get('/:id', async(req, res)=>{
  try{
    const id = req.params.id
    const reponse = await message.findById(id)
    res.status(200).json({
      success : true,
      message : "data sent successfully.",
      reponse
    })
  }catch(err){
    res.status(200).json({
      success : false,
      error : err,
      reponse
    })
  }
  
})

module.exports = router;

async function addMessages(userId, toUserId, messageId) {
  const existingList = await MessagesList.findOne({ userId });

  if (existingList) {
    console.log("triggered update");
    const userExistsInList = existingList.messagesList.find(
      (message) => message.userId.toString() === toUserId
    );
    if (userExistsInList) {
      const response = await MessagesList.findOneAndUpdate(
        { userId, 'messagesList.userId': toUserId },
        { $push: { 'messagesList.$.messagesId': messageId } },
        { new: true }
      );
      console.log("Updated MessagesList:", response);
    } else {
      const response = await MessagesList.findOneAndUpdate(
        { userId },
        { $push: { messagesList: { userId: toUserId, messagesId: [messageId] } } },
        { new: true }
      );
    }
  } else {
    const newMessageList = new MessagesList({
      userId,
      messagesList: [
        {
          userId: toUserId,
          messagesId: [messageId],
        },
      ],
    });

    await newMessageList.save();
  }
}
