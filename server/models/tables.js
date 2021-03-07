const sequelize = require('../config/config');
const { DataTypes } = require('sequelize');

//defining User table
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    notEmpty: true,
    notNull: true,
    len: [2, 20],
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    isEmail: true,
    notEmpty: true,
    notNull: true,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    notEmpty: true,
    notNull: true
  },
  image: {
    type: DataTypes.STRING,
    isUrl: true,
    notNull: true
  },
});

User.sync();

module.exports = { User };