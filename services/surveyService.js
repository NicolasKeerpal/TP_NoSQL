const Survey = require('../models/Surveys');

// Service function to get a specific Sondage document by ID
async function getSurveyById(surveyId) {
  try {
    const survey = await Survey.findById(surveyId);
    return survey;
  } catch (error) {
    throw error;
  }
}

// Service function to get all surveys
async function getAllSurvey() {
  try {
    const surveys = await Survey.find();
    return surveys;
  } catch (error) {
    throw error;
  }
}

// Service function to add a new survey
async function addSurvey(topic, questions, userId) {
  try {
    const survey = new Survey({
      topic,
      creator: userId, // Assign the user id directly here
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
    // Find the survey by ID and delete it
    await Survey.findByIdAndDelete(surveyId);
  } catch (error) {
    throw error;
  }
}


// Service function to update a survey by ID
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
