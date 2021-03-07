const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(
  process.env.JAWSDB_URL || 'postgresql://messenger_user:messenger_password@localhost:5432/messenger_db'
);

module.exports = sequelize;