const Answer = require('../models/Answers');

async function addAnswer(surveyId, userId, answers) {
  try {
    const answer = new Answer({
      survey_id: surveyId,
      user_id: userId,
      answers: answers.map(answer => ({
        question_id: answer.questionId,
        answer: answer.answer
      }))
    });

    await answer.save();
    return answer;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  addAnswer
};
