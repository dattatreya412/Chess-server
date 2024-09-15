const express = require("express");
const jwt = require("jsonwebtoken"); // Added this line to ensure JWT is included
const User = require("../models/user"); // Ensure you have your User model correctly imported

const bcrypt = require("bcrypt");
const { isValidObjectId } = require("mongoose");

const router = express.Router();

// Register route
router.post("/register", async (req, res) => {
  console.log("in register");
  const {
    username,
    firstName,
    lastName,
    email,
    country,
    password,
    playerNotes,
  } = req.body;
  if (isValidObjectId(playerNotes)) console.log("valid id");
  // Check if username and password are provided
  if (!username || !firstName || !lastName || !email || !country || !password) {
    return res.status(400).json({ message: "Enter the required feilds." });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }
    bcrypt.hash(password, 10, async (err, hash) => {
      // Store hash in your password DB.
      if (err) {
        console.log(err);
      } else {
        const newUser = new User({
          username,
          firstName,
          lastName,
          email,
          country,
          password: hash,
          playerNotes,
        });
        console.log(newUser);
        await newUser.save();
      }
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error); // Log the full error to debug
    res.status(500).json({ message: "Error registering user" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  console.log("in login");
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });
    console.log("Found user:", user); // Debugging line

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // **Use bcrypt.compare to check the password**
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "a secret code",
      {
        // Use environment variable or fallback
        expiresIn: "1h",
      }
    );

    // Send the token to the client
    res.json({ token });
  } catch (error) {
    console.error("Error logging in:", error); // Log the error for debugging
    res.status(500).json({ message: "Error logging in" });
  }
});

module.exports = router;
