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

//defining message table
const Message = sequelize.define('Message', {
  from: {
    type: DataTypes.INTEGER,
    notEmpty: true,
    notNull: true
  },
  body: {
    type: DataTypes.STRING,
    notEmpty: true,
    notNull: true,
  },
  seen: {
    type: DataTypes.BOOLEAN,
    notNull: true
  }
});

//defining conversation table
const Conversation = sequelize.define('Conversation', {});

Conversation.belongsTo(User, { foreignKey: { allowNull: false }, as: 'firstUser', onDelete: 'CASCADE' });
Conversation.belongsTo(User, { foreignKey: { allowNull: false }, as: 'secondUser', onDelete: 'CASCADE' });

Message.belongsTo(Conversation, { foreignKey: { allowNull: false }, as: 'conversation', onDelete: 'CASCADE' });

(async () => {
  await User.sync();
  await Conversation.sync();

  // add a constraint that the ID of the first user is less than or equal to the ID of the second user
  // this way, we ensure each pair of users is unique
  sequelize.query(`
    DO $$
    BEGIN
      BEGIN
        ALTER TABLE "Conversations" ADD CONSTRAINT id_ordering CHECK("firstUserId" <= "secondUserId");
      EXCEPTION
        WHEN duplicate_object THEN NULL;
      END;
    END $$;`);
  sequelize.query(`CREATE UNIQUE INDEX IF NOT EXISTS conversation_by_users ON "Conversations" ("firstUserId", "secondUserId");`);

  await Message.sync();
})();

module.exports = { User, Message, Conversation };