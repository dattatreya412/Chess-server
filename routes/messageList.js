const express = require("express");
const MessageList = require("../models/messagesList");

const router = express.Router();

router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const list = await MessageList.find({ userId });
    res.status(200).json({
      succcess: true,
      message: "fetched datasuccess fully.",
      list,
    });
  } catch (err) {
    res.status(500).json({
      succcess: false,
      message: "internal server error.",
      list,
    });
  }
});
module.exports = router;
