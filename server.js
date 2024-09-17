const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const cors = require("cors");
const socketHandler = require("./socket");
const connectdb = require("./Database/connectdb");
const authMiddleware = require("./middleware/auth");
const userRoutes = require("./routes/user");
const messageRoutes = require("./routes/message");
const friendRoutes = require("./routes/friends");
const puzzlesRouter = require("./routes/puzzles");
const newsRouter = require("./routes/news");
const notesRouter = require("./routes/notes");
const authRouter = require("./routes/auth");
const gameRouter = require('./routes/gameArchive')
const helpRouter = require('./routes/help')
const watchRouter = require('./routes/watch')
const messageListRouter = require('./routes/messageList')

const connectFriendRouter = require('./routes/connectFriend')
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
  },
});
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json({ limit: '50mb' }));  
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/messageList', messageListRouter)
app.use('/connectFriend', connectFriendRouter)
app.use("/watch", watchRouter)
app.use("/api/auth", authRouter);
app.use("/help", helpRouter)
app.use("/user", userRoutes);
app.use("/message", messageRoutes);
app.use("/friends", friendRoutes);
app.use("/puzzles", puzzlesRouter);
app.use("/news", newsRouter);
app.use("/notes", notesRouter);
app.use("/gameArchive", gameRouter)
// Example protected route
// app.get('/protected', authMiddleware, (req, res) => {
//     res.status(200).json({ message: 'This is a protected route', user: req.user });
// });

// Serve static files from the React app's build directory
app.use(express.static(path.join(__dirname, "build")));

// Serve index.html for all routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Initialize Socket.IO logic
socketHandler(io);

// Connect to the database
connectdb();

// Start the server
server.listen(4000, () => {
  console.log("Server running on port 4000");
});
