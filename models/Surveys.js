const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
  topic: { type: String, required: true, unique: true },
  creator: { type: String, required: true, unique: true },
  questions: [
    {
      title: { type: String, required: true },
      type: { type: String, enum: ['ouverte', 'qcm'], required: true },
      answers: { type: [String] }
    }
  ]
});

const Surveys = mongoose.model('Surveys', surveySchema);

module.exports = Surveys;
