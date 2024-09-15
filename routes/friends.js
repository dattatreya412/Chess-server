const express = require("express");
const User = require("../models/user");
const Friends = require("../models/friends");
const { isValidObjectId } = require("mongoose");

const router = express.Router();

// router.post("/", async (req, res) => {
//   const { userId, friendId } = req.body;

//   try {
//     // Validate the user IDs
//     if (!isValidObjectId(userId) || !isValidObjectId(friendId)) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid user ID or friend ID" });
//     }

//     // Check if the user exists
//     const user = await User.findById(userId);
//     if (!user) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found" });
//     }

//     // Check if the friend exists
//     const friend = await User.findById(friendId);
//     if (!friend) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Friend not found" });
//     }

//     // Update the Friends collection
//     const friendInUserFriends = await Friends.findOne({ user: userId });
//     if (!friendInUserFriends) {
//       // If the user does not have a friends document, create one
//       const newFriendDoc = new Friends({ user: userId, friends: [friendId] });
//       await newFriendDoc.save();
//     } else if (!friendInUserFriends.friends.includes(friendId)) {
//       // If the friend is not in the array, add them
//       friendInUserFriends.friends.push(friendId);
//       await friendInUserFriends.save();
//     } else {
//       return res
//         .status(400)
//         .json({ success: false, message: "Friend is already added" });
//     }

//     // Update the User's friends array
//     if (!user.playerFriends.includes(friendId)) {
//       user.playerFriends.push(friendId);
//       await user.save();
//     }

//     // Optionally, you can also update the friend's playerFriends array to include the userId
//     if (!friend.playerFriends.includes(userId)) {
//       friend.playerFriends.push(userId);
//       await friend.save();
//     }

//     res
//       .status(200)
//       .json({ success: true, message: "Friend added successfully" });
//   } catch (err) {
//     console.error("Error adding friend:", err);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// });
// router.post('/init', async(req, res)=>{
//   try{
//     const {user} = req.body
//     const newFriendDoc = await new Friends({user})
//     await newFriendDoc.save()
//     res.status(201).json({
//       success : true, 
//       message : "sucessfully created friends list ",
//       newFriendDoc
//     })
//   }catch(err){
//     res.status(500).json({
//       success : false,
//       message : "cant initiate the friend db",
//       error : err
//     })
//   }
// })

router.get("/", async (req, res) => {
  try {
    if (!Friends.findOne())
      res.status(401).json({ success: false, message: "not avilable" });
    const data = await Friends.find();
    res.status(201).json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "friends are unavilable",
    });
  }
});

module.exports = router;
