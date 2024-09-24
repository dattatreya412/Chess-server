const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lessonSchema = new Schema({
  lessonImg : {
    type: String,
    required: true
  },
  lessonTitle : {
    type: String,
    required: true
  },
  lessonContent : {
    type: String,
    required: true
  },
  lessonGuide : [
  {
    from : {
      type: String,
      required: true
    },
    to : {
      type: String,
      required: true
    },
    promotion : {
      type: String,
      required: true
    },
    correct :{
        type: String,
        required: true
    },
    wrong : {
        type: String,
        required: true
    }
  }
]
});

const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson;
