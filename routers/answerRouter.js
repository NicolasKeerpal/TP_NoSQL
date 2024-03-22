const express = require('express');
const router = express.Router();
const answerController = require('../controllers/answerController');
const { verifyToken } = require('../middleware/verifyToken');

router.use(verifyToken);

router.post('/survey/:id/answer', answerController.addAnswer);

module.exports = router;
