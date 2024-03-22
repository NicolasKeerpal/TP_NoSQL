const Survey = require('../models/Surveys');

async function getSurveyById(surveyId) {
  try {
    const survey = await Survey.findById(surveyId);
    return survey;
  } catch (error) {
    throw error;
  }
}

async function getAllSurvey() {
  try {
    const surveys = await Survey.find();
    return surveys;
  } catch (error) {
    throw error;
  }
}

async function addSurvey(topic, questions, userId) {
  try {
    const survey = new Survey({
      topic,
      creator: userId,
      questions
    });

    await survey.save();
    return survey;
  } catch (error) {
    throw error;
  }
}

async function deleteSurveyById(surveyId) {
  try {
    await Survey.findByIdAndDelete(surveyId);
  } catch (error) {
    throw error;
  }
}


async function updateSurvey(id, updatedFields) {
  try {
    const updatedSurvey = await Survey.findByIdAndUpdate(id, updatedFields, { new: true });
    return updatedSurvey;
  } catch (error) {
    throw error;
  }
}



module.exports = {
  getSurveyById,
  getAllSurvey,
  addSurvey,
  deleteSurveyById,
  updateSurvey
};
