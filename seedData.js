const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Users = require('./models/Users');
const Answers = require('./models/Answers');
const Surveys = require('./models/Surveys');

const userData = [
  {
    username: 'John Wick',
    password: '123'
  },
  {
    username: 'John Cena',
    password: '1234'
  }
];

const answerData = [

  {
    survey_id: '5fc1123f5f5e6f7801234567',
    user_id: '5f3a31234d5679gdrrg0123456',
    answers: [
      {
        question_id: '5f3a3c1d1234567890123456',
        answer: '1.8.9'
      },
      {
        question_id: '5f3a3e1f1234567890123456',
        answer: ['Oui', 'Bed quoi ?']
      }
    ]
  }

];

const surveyData = [
  {
    topic: 'Sondage Minecraft',
    creator: '5f3a31234d5679gdrrg0123456',
    questions: [
      {
        title: 'Quel version de minecraft vous jouez ? ( expl : 1.8.9 )',
        type: 'ouverte'
      },
      {
        title: 'Avez vous jouez à bedwars ?',
        type: 'qcm',
        answers: ['Oui', 'Non', 'Jamais', ' Bed quoi ?']
      }
    ]
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/SurveyAga', { useNewUrlParser: true, useUnifiedTopology: true });

    // Check if the database exists
    const db = mongoose.connection.db;
    const existingCollections = await db.listCollections().toArray();
    const existingCollectionsNames = existingCollections.map(collection => collection.name);

    // Drop existing collections if they exist
    if (existingCollectionsNames.includes('users')) {
      await db.dropCollection('users');
      console.log('Users collection dropped successfully');
    }

    if (existingCollectionsNames.includes('answers')) {
      await db.dropCollection('answers');
      console.log('Answers collection dropped successfully');
    }

    if (existingCollectionsNames.includes('surveys')) {
      await db.dropCollection('surveys');
      console.log('Surveys collection dropped successfully');
    }

    // Hash passwords before inserting users
    const hashedUserData = await Promise.all(userData.map(async user => ({
      username: user.username,
      password: await bcrypt.hash(user.password, 10)
    })));

    // Insert user data into the database
    await Users.insertMany(hashedUserData);
    console.log('User data inserted successfully');

    // Insert response data into the database
    await Answers.insertMany(answerData);
    console.log('Answer data inserted successfully');

    // Insert survey data into the database, creating them if they don't exist
    await Promise.all(surveyData.map(async survey => {
      const existingSurvey = await Surveys.findOne({ topic: survey.topic });
      if (!existingSurvey) {
        await Surveys.create(survey);
        console.log(`Survey "${survey.topic}" created successfully`);
      }
    }));

    console.log('Survey data inserted successfully');

  } catch (error) {
    console.error('Error seeding database:', error);
  }
}



module.exports = seedDatabase;