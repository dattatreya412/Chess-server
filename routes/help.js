const express = require("express");
const Help = require("../models/help");
const router = express.Router();

router.post("/send-report", async (req, res) => {
  try {
    const { message, userId } = req.body;
    const newHelp = await new Help({
      message,
      userId
    });
    await newHelp.save();
    res.status(201).json({
      success: true,
      mssage: "Report sent successfully.",
      newHelp,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to send the Report.",
      error: err,
    });
  }
});

module.exports = router