const Sequelize = require('sequelize');
const sequelize = require('../config/database'); // Ensure this path is correct

const User = sequelize.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  // Include other fields as necessary
});

module.exports = User;
