const express = require('express');
const mongoose = require('mongoose');
const loginRoutes = require('./routers/loginRouter');
const userRoutes = require('./routers/userRouter');
const surveyRoutes = require('./routers/surveyRouter');
const answerRoutes = require('./routers/answerRouter');

const { verifyToken } = require('./middleware/verifyToken');

const seedDatabase = require('./seedData');

const app = express();
app.use(express.json());

//To connect to MongoDB
mongoose.connect('mongodb://localhost:27017/SurveyAga', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    seedDatabase();
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));

//Since we want to log in, verifyToekn come after
app.use(loginRoutes); 

app.use(verifyToken);

app.use(userRoutes);
app.use(surveyRoutes);
app.use(answerRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
