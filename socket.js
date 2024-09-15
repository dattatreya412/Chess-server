const generateUniqueId = require("generate-unique-id");
const { Chess } = require("chess.js");
const User = require("./models/user");
const GameArchive = require('./models/gameArchive');

const rooms = {};
const socketToObjectId = {};
let gameArchiveId

module.exports = (io) => {
  io.on("connection", (uniqueSocket) => {
    let objectId; 
    console.log(uniqueSocket.id + " connected.");
    uniqueSocket.emit("connection");

    uniqueSocket.on("reconnect", () => {
      console.log("reconnecting...");
      setTimeout(() => {
        uniqueSocket.emit("connection");
        console.log("connected...")
      }, 5000);
    });

    uniqueSocket.on("sendObjectId", (id) => { 
      objectId = id; 
      socketToObjectId[uniqueSocket.id] = objectId; // Store the mapping
    });

    let roomName;

    // 
    uniqueSocket.on('joinSpectator', async ({ roomId }) => { 
      console.log(`Spectator ${uniqueSocket.id}  trying joining room: ${roomId}`);
      try {
        uniqueSocket.join(roomId);
        console.log(`Spectator ${uniqueSocket.id} joined room: ${roomId}`);
      } catch (err) {
        console.error('Error in joinSpectator:', err);
        uniqueSocket.emit('error', { message: 'Could not join as spectator' });
      }
    });
    // 

    uniqueSocket.on("joinRoom", async ({ time }) => {
      // Check if there's a room with the same time that has only one player
      const existingRoom = Object.keys(rooms).find(
        (roomId) =>
          rooms[roomId].time === time && rooms[roomId].players.length === 1
      );

      if (existingRoom) {
        roomName = existingRoom;
      } else {
        roomName = generateUniqueId({
          includeSymbols: ["@"],
          length: 16,
          useLetters: true,
          useNumbers: true,
        });
        rooms[roomName] = { 
          players: [], 
          game: new Chess(), 
          time, 
          objectIds: [] // Initialize objectIds array for storing players' object IDs
        };
      }

      await User.findByIdAndUpdate(objectId, {
        isPlaying: true,
        gameID: roomName,
      }, { new: true });

      if (rooms[roomName].players.length < 2) {
        rooms[roomName].players.push(uniqueSocket.id);
        rooms[roomName].objectIds.push(objectId); // Store the player's object ID in the room
        uniqueSocket.join(roomName); // Join the room
        uniqueSocket.emit(
          "playerRole",
          rooms[roomName].players.length === 1 ? "w" : "b"
        );
        if (rooms[roomName].players.length === 2) {
          io.to(roomName).emit("startGame", roomName); // Notify both players to start the game
            const whitePlayerId = rooms[roomName].objectIds[0];
            const blackPlayerId = rooms[roomName].objectIds[1];
            console.log(whitePlayerId + " " + blackPlayerId)
            
            try{
              const newGameArchive = new GameArchive({
                  isLive : true,
                  whitePlayerId,
                  blackPlayerId,
                  spectatorId :roomName
              })
              const response = await newGameArchive.save()
              console.log(response)
              gameArchiveId = response._id
              addGameToPlayedGames(whitePlayerId,gameArchiveId)
              addGameToPlayedGames(blackPlayerId,gameArchiveId)
          }catch(err){
              console.log("here" + err)
            }

        }
      } else {
        uniqueSocket.emit("spectatorRole");
      }
    });

    uniqueSocket.on("move", (move) => {
      const room = rooms[roomName];
      if (room) {
        try {
          if (
            (room.game.turn() === "w" && uniqueSocket.id !== room.players[0]) ||
            (room.game.turn() === "b" && uniqueSocket.id !== room.players[1])
          ) {
            return;
          }
          let result = room.game.move(move);
          if (result) {
            addMoveToArchive(move, gameArchiveId)
            io.to(roomName).emit("move", result.san);
            io.to(roomName).emit("boardState", room.game.fen());
          } else {
            console.log("invalid move");
            uniqueSocket.emit("invalidMove", move);
          }

          const gameOver = room.game.isGameOver();
          if (gameOver) {
            const winner = room.game.isCheckmate()
              ? room.game.turn() === "w"
                ? "b"
                : "w"  
              : "draw";
            setGameStatus(winner, gameArchiveId)
            io.to(roomName).emit("gameOver", winner);
            exitRoom(objectId);
          }
          io.to(roomName).emit("switchTimerInClient", room.game.turn());
        } catch (err) {
          console.log("error occurred.");
          console.log(err);
          uniqueSocket.emit("invalidMove", move);
        }
      }
    });

    uniqueSocket.on("gameCompleted", () => {
      exitRoom(objectId);
    });

    uniqueSocket.on("timeout", (loser) => {
      setGameStatus(loser === 'w' ? 'b' : 'w')
      io.to(roomName).emit("timeoutPlayer", loser);
      exitRoom(objectId);
    });

    uniqueSocket.on("sendMessage", (message) => {
      io.to(roomName).emit("messageFromServer", message);
    });

    uniqueSocket.on("disconnect", async () => {
      // Set isLive state to false
      await User.findByIdAndUpdate(objectId, {
        isLive: false,
      });

      exitRoom(objectId);

      for (const roomName in rooms) {
        const room = rooms[roomName];
        if (room.players.includes(uniqueSocket.id)) {
          room.players = room.players.filter((id) => id !== uniqueSocket.id);
          room.objectIds = room.objectIds.filter((id) => id !== objectId); // Remove object ID from the room

          if (room.players.length === 0 || room.players.length === 1) {
            delete rooms[roomName]; // Remove the room if empty
          } else {
            io.to(roomName).emit("gameOver", "opponent disconnected");
          }
        }
      }

      delete socketToObjectId[uniqueSocket.id]; // Clean up the mapping
      console.log(uniqueSocket.id + " disconnected.");
    });
  });
};

async function exitRoom(objectId) {
  await User.findByIdAndUpdate(objectId, {
    isPlaying: false,
    gameID: "",
  }); 
  await GameArchive.findByIdAndUpdate(gameArchiveId,{
    isLive : false
  })
}
     
async function addMoveToArchive(move, archiveId){
  try{
    await GameArchive.findByIdAndUpdate(
      archiveId, 
    {$push : {moves : move}} )
  }catch(err){
    console.log(err)
  }
}


async function addGameToPlayedGames(userId, gameId) {
  try {
    await User.findByIdAndUpdate(
      userId, 
      { $push: { playedGames: gameId } },  
      { new: true, useFindAndModify: false } 
    );
    console.log(`Game with ID ${gameId} added to user with ID ${userId}`);
  } catch (err) {
    console.error("Error adding game to playedGames:", err);
  }
}

async function setGameStatus(status, gameId){
  try{
    await GameArchive.findByIdAndUpdate(gameId, {
      winner : status === 'w' ? 'white' : status === 'b' ? 'black' : 'draw',
      isLive : false
    })
  }catch(err){
    console.log(err)
  }
}