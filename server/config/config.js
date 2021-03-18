const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(
  process.env.JAWSDB_URL || process.env.LOCAL_CONN_STR
);

module.exports = sequelize;