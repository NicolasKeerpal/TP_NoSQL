const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  survey_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  user_id: { type: String, required: true }, // Change type to String
  answers: [
    {
      question_id: { type: mongoose.Schema.Types.ObjectId, required: true },
      answer: { type: mongoose.Schema.Types.Mixed, required: true }
    }
  ]
});

const Answers = mongoose.model('Answers', answerSchema);

module.exports = Answers;
