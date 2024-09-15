const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  highlights: {
    img: String,
    title: String,
  },
  news: [
    {
      img: String,
      title : String,
      date: {
        type: Date,
        default: Date.now,
      },
      description: String,
    },
  ],
});

module.exports = mongoose.model("News", newsSchema);
