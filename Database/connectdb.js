const mongoose = require("mongoose");

async function connectdb() {
  try {
    await mongoose.connect(
      "mongodb+srv://dattatreya412:Datta%404121211@chess.r6ndh.mongodb.net/"
    );
    console.log("connected to a database");
  } catch (err) {
    console.error(err);
  }
}

module.exports = connectdb;
