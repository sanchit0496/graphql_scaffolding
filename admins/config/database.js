const Sequelize = require('sequelize');
const sequelize = new Sequelize('graphql_database', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;