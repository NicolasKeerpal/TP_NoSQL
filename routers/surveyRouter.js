const express = require('express');
const router = express.Router();
const surveyController = require('../controllers/surveyController');

const { verifyToken } = require('../middleware/verifyToken');

// Apply token middleware to protect routes
router.use(verifyToken);

router.get('/survey/:id', surveyController.getSurveyById);
router.get('/survey', surveyController.getAllSurvey);
router.post('/survey/add', surveyController.addSurvey);
router.delete('/survey/:id', surveyController.deleteSurveyById);
// Update a survey
router.put('/survey/:id', surveyController.updateSurveyById);



module.exports = router;
