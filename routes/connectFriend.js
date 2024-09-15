const express = require("express");
const ConnectFriend = require("../models/connectFriend");
const Friends = require("../models/friends");
const { isValidObjectId } = require("mongoose");
const User = require('../models/user')

const router = express.Router();

router.post("/sendRequest", async (req, res) => {
  try {
    const { status, sentBy, sentTo } = req.body;

    // Validate Object IDs first
    if (!isValidObjectId(sentBy) || !isValidObjectId(sentTo)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user IDs provided.",
      });
    }

    // Create new connection
    const newConnection = new ConnectFriend({
      status,
      sentBy,
      sentTo,
    });
    await newConnection.save();
    +(
      // Add pending requests to both users
      (await addPendingRequest(sentBy, newConnection._id))
    );
    await addPendingRequest(sentTo, newConnection._id);

    res.status(200).json({
      success: true,
      message: "Connection request sent successfully.",
      newConnection,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to send request.",
      error: err.message,
    });
  }
});

async function addPendingRequest(user, connectionId) {
  // Check if the user already has a Friends document
  const userFriends = await Friends.findOne({ user });
  if (userFriends) {
    // User exists, push the new connection request ID to pendingRequests
     await Friends.findOneAndUpdate(
      { user },
      { $push: { pendingRequests: connectionId } },
      { new: true } // This option returns the modified document
    );
    await User.findByIdAndUpdate(
        user,
        {}
    )
  } else {
    // User doesn't have a Friends document, create a new one
    const newFriends = new Friends({
      user,
      friends: [connectionId], // Initialize with the new connection request ID
    });
    await newFriends.save();
  }
}

router.put("/acceptRequest", async (req, res) => {
  try {
    const { reqId, userId } = req.body;
    if (!(await ConnectFriend.findOne({ _id: reqId, sentTo: userId }))) {
      res.status(400).json({
        success: false,
        message: "you cant accept the request.",
      });
    }
    await ConnectFriend.findOneAndUpdate(
      { _id: reqId, sentTo: userId },
      {
        status: "connected",
      }
    );
    res.status(200).json({
      success: true,
      message: "Request accepted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "unable to accpt request.",
    });
  }
});

router.put("/block", async (req, res) => {
  try {
    const { reqId, userId } = req.body;
    if (!(await ConnectFriend.findOne({ _id: reqId, sentTo: userId }))) {
      res.status(400).json({
        success: false,
        message: "you cant block the request.",
      });
    }
    await ConnectFriend.findOneAndUpdate(
      { _id: reqId, sentTo: userId },
      {
        status: "block",
      }
    );
    res.status(200).json({
      success: true,
      message: "Blocked!",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "unable to block request.",
    });
  }
});

router.put("/rejectRequest", async (req, res) => {
  try {
    const { reqId, userId } = req.body;
    if (!(await ConnectFriend.findOne({ _id: reqId, sentTo: userId }))) {
      res.status(400).json({
        success: false,
        message: "you cant reject the request.",
      });
    }
    await ConnectFriend.findOneAndUpdate(
      { _id: reqId, sentTo: userId },
      {
        status: "rejected",
      }
    );
    res.status(200).json({
      success: true,
      message: "Request rejected.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "unable to reject request.",
    });
  }
});

module.exports = router;
