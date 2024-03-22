const Answer = require('../models/Answers');
const jwt = require('jsonwebtoken');

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

async function addAnswer(req, res) {
  try {
    const { answers } = req.body;
    const survey_id = req.params.id;
    
    const user_id = req.user.userId; 

    //Check information
    console.log('User ID:', user_id);
    console.log('Survey ID:', survey_id);


    if (!user_id || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Invalid request body' });
    }

    const answer = new Answer({
      survey_id,
      user_id,
      answers
    });

    await answer.save();

    res.status(201).json({ message: 'Answer added successfully' });
  } catch (error) {
    console.error('Error adding Answer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  addAnswer,
  verifyToken
};