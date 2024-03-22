const jwt = require('jsonwebtoken');
const Survey = require('../models/Surveys');
const surveyService = require('../services/surveyService');
const surveyResponse = require('../services/answerService');
const Surveys = require('../models/Surveys');

// Middleware to verify JWT token and extract user id
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, 'secret');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
}

// Controller function to get a specific Survey document by ID
async function getSurveyById(req, res) {
  const surveyId = req.params.id;

  try {
    const survey = await Surveys.findById(surveyId);
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }
    res.json(survey);
  } catch (error) {
    console.error('Error getting survey by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Controller function to get all surveys
async function getAllSurvey(req, res) {
  try {
    const surveys = await Surveys.find();
    res.json(surveys);
  } catch (error) {
    console.error('Error getting all surveys:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Controller function to add a new survey
async function addSurvey(req, res) {
  const { topic, questions } = req.body;

  try {
    // Assuming userId is obtained from authentication middleware or some other source
    const userId = req.user.userId; 
    console.log('User ID:', userId); // Log the user ID

    // Check if the survey already exists
    const existingSurvey = await Surveys.findOne({ topic });
    if (existingSurvey) {
      return res.status(400).json({ message: 'Survey already exists' });
    }

    // If the survey doesn't exist, proceed to add it with the user id
    await surveyService.addSurvey(topic, questions, userId);
    
    // Respond with a 201 status code indicating success
    res.status(201).json({ message: 'Survey added' });
  } catch (error) {
    // If an error occurs, log the error and return a 500 status code with an error message
    console.error('Error adding survey:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


// Controller function to delete a survey by ID
async function deleteSurveyById(req, res) {
  const surveyId = req.params.id;
  const userId = req.user.userId; // Assuming userId is obtained from authentication middleware

  try {
    // Find the survey by ID
    const survey = await Surveys.findById(surveyId);

    // If the survey does not exist, return 404
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    // Check if the user is the owner of the survey
    if (survey.creator.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized: You are not the owner of this survey' });
    }

    // Send success message first
    res.status(200).json({ message: 'Survey deletion request received. Deleting survey...' });

    // Call the service function to delete the survey
    await surveyService.deleteSurveyById(surveyId);
  } catch (error) {
    console.error('Error deleting survey:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Controller function to update a survey by ID
async function updateSurveyById(req, res) {
  const { id } = req.params;
  const { topic, questions } = req.body;
  const userId = req.user.userId; // Assuming userId is obtained from authentication middleware

  try {
    // Find the survey by ID
    const survey = await Surveys.findById(id);

    // If the survey does not exist, return 404
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    // Check if the user is the owner of the survey
    if (survey.creator.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized: You are not the owner of this survey' });
    }

    // Update the survey
    const updatedSurvey = await surveyService.updateSurvey(id, { topic, questions });
    res.json(updatedSurvey);
  } catch (error) {
    console.error('Error updating survey:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}



module.exports = {
  getSurveyById,
  getAllSurvey,
  addSurvey,
  verifyToken,
  deleteSurveyById,
  updateSurveyById
};