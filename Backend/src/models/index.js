const sequelize = require('../config/db');
const User = require('./user.model');
const Family = require('./family.model');
const Membership = require('./membership.model');
const setupAssociations = require('./associations');

// init
const models = {
  User: User.initModel(sequelize),
  Family: Family.initModel(sequelize),
  Membership: Membership.initModel(sequelize),
};

setupAssociations(sequelize);

module.exports = { sequelize, ...models };
