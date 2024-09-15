const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema({
  notes: [String],
});

module.exports = mongoose.model("Notes", notesSchema);
