const Sequelize = require('sequelize');
const sequelize = require('../config/database'); // Ensure this path is correct

const Admin = sequelize.define('admin', {
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
// Admin.sync() -> This line is added to create table as per schema defined above
module.exports = Admin;
