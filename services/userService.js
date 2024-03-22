const bcrypt = require('bcrypt');
const User = require('../models/Users');

async function loginUser(username, password) {
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return { success: false, message: 'Invalid credentials' };
    }

    return { success: true, message: 'Login successful' };
  } catch (error) {
    console.error('Error while logging in:', error);
    throw new Error('Internal server error');
  }
}

async function getAllUsers() {
  try {
      const users = await User.find();
      return users;
  } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
  }
}


module.exports = {
  loginUser,
  getAllUsers
};
