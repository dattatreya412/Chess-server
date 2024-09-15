const express = require("express");
const User = require("../models/user");
const { isValidObjectId } = require("mongoose");

const router = express.Router();

// Route to create a new user
router.post("/", async (req, res) => {
  try {
    const {
      username,
      firstName,
      lastName,
      email,
      password,
      country,
      bio,
      playerNotes,
    } = req.body;
    const newUser = new User({
      username,
      firstName,
      lastName,
      email,
      password,
      country,
      bio,
      playerNotes,
    });
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (err) {
    console.error("Error creating user:", err); // Log the error for debugging
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message, // Include the error message in the response
    });
  }
});

router.get("/getusername/:objectId", async (req, res) => {
  const objectId = req.params.objectId;
  try {
    const user = await User.findById(objectId, { username: 1 }); 

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      username: user.username, // Access the username directly from the document
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});



router.get("/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const data = await User.findOne({ username });
    res.status(201).json({
      success: true,
      message : 'found user with similar username.',
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "failed to find the user " + err,
    });
  }
});


router.put('/isLive/:objectID', async(req, res)=>{
  try{
    const objectId = req.params.objectID
    const {isLive} = req.body
    if(!isValidObjectId(objectId)) {
      return res.status(400).json({
        success : false,
        message : "can't find the object id, sharching for.."
      })
    }
    const updatedUser = await User.findByIdAndUpdate(objectId, {isLive})
    res.status(200).json({
      success : true,
      message : "sucessfully uploaded the status.",
      updatedUser
    })
  }catch(err){
    console.error("an error has occoured while uploading thee status " + err)
  }
})

router.put('/isPlaying/:objectId', async(req, res)=>{
  try{
  const objectId = req.params.objectId
  const {isPlaying, gameID} = req.body //added gameid
  if(!objectId){
    res.status(400).json({
      success : false,
      message : "invalid ObjectID provided.."
    })
  }
  const updatdUser = await User.findByIdAndUpdate(objectId, {isPlaying, gameID}) //added gameid


  res.status(200).json({
    success : true,
    message : "successfully changed the playing state",
    updatdUser
  })
}catch(err){
  res.status(200).json({
    success : false,
    error : "unable change the playing state try again.." + err,
    updatdUser
  })
}
})

// router.get('/findAll/user', async (req, res)=>{
//   const {searchText} = req.body
//   try{
//     const usernames = await User.find({ 
//       username: { $regex: searchText, $options: 'i' } // 'i' makes the search case-insensitive
//     },
//     {username : 1, _id : 0})
//     res.status(200).json({
//       sucess : true,
//       message : "sucessfully fetched the user details.",
//       usernames
//     })
//   }catch(err){
//     res.status(500).json({
//       success : false,
//       message : "unable to fetch data.",
//       error : err
//     })
//   }
// })
router.get('/findAll/user', async (req, res) => {
  const { searchText } = req.query; // Use req.query for GET requests
  try {
    if(!searchText.trim()){
      return res.status(200).json({
        success: true, // Fixed typo from "sucess" to "success"
        message: "Successfully fetched the user details.",
        usernames : []
      })
    }
    const usernames = await User.find(
      { 
        username: { $regex: `^${searchText}`, $options: 'i' } // Case-insensitive search
      },
      { username: 1,isLive : 1, isPlaying : 1, _id: 0 } // Only return the username field
    ).limit(5)

    res.status(200).json({
      success: true, // Fixed typo from "sucess" to "success"
      message: "Successfully fetched the user details.",
      usernames
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch data.",
      error: err.message // Provide more detailed error message
    });
  }
});

module.exports = router;