const express = require("express");
const MessageList = require("../models/messagesList");

const router = express.Router();

router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const list = await MessageList.findOne({ userId })

      .populate({
        path: 'messagesList.messagesId',
        select: 'sentBy sentTo message' // Select fields from the Message model
      });
    
    res.status(200).json({
      success: true,
      message: "Data fetched successfully.",
      list,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: err.message,
    });
  }
});
// router.get("/detailed/:userId", async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const list = await MessageList.find({ userId });
//     res.status(200).json({
//       succcess: true,
//       message: "fetched datasuccess fully.",
//       list,
//     });
//   } catch (err) {
//     res.status(500).json({
//       succcess: false,
//     });
//   }
// });
module.exports = router;
