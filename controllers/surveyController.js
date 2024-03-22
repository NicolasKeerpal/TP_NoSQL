const jwt = require('jsonwebtoken');
const Survey = require('../models/Surveys');
const surveyService = require('../services/surveyService');
const surveyResponse = require('../services/answerService');
const Surveys = require('../models/Surveys');

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

async function getAllSurvey(req, res) {
  try {
    const surveys = await Surveys.find();
    res.json(surveys);
  } catch (error) {
    console.error('Error getting all surveys:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function addSurvey(req, res) {
  const { topic, questions } = req.body;

  try {
    const userId = req.user.userId; 

    console.log('User ID:', userId);

    const existingSurvey = await Surveys.findOne({ topic });
    if (existingSurvey) {
      return res.status(400).json({ message: 'Survey already exists' });
    }

    await surveyService.addSurvey(topic, questions, userId);
    
    res.status(201).json({ message: 'Survey added' });
  } catch (error) {
    console.error('Error adding survey:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


async function deleteSurveyById(req, res) {
  const surveyId = req.params.id;
  const userId = req.user.userId;

  try {
    const survey = await Surveys.findById(surveyId);

    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    if (survey.creator.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized: You are not the owner of this survey' });
    }

    res.status(200).json({ message: 'Survey deletion request received. Deleting survey...' });

    await surveyService.deleteSurveyById(surveyId);
  } catch (error) {
    console.error('Error deleting survey:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function updateSurveyById(req, res) {
  const { id } = req.params;
  const { topic, questions } = req.body;
  const userId = req.user.userId;

  try {
    const survey = await Surveys.findById(id);

    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    if (survey.creator.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized: You are not the owner of this survey' });
    }

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