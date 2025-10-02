const sequelize = require('../config/db');
const User = require('./user.model');
const Family = require('./family.model');
const Membership = require('./membership.model');

// init
const models = {
  User: User.initModel(sequelize),
  Family: Family.initModel(sequelize),
  Membership: Membership.initModel(sequelize),
};

// associations
models.User.hasMany(models.Membership, { foreignKey: 'user_id' });
models.Membership.belongsTo(models.User, { foreignKey: 'user_id' });

models.Family.hasMany(models.Membership, { foreignKey: 'family_id' });
models.Membership.belongsTo(models.Family, { foreignKey: 'family_id' });

// family parent relationship
models.Family.hasMany(models.Family, { foreignKey: 'parent_family_id', as: 'children' });
models.Family.belongsTo(models.Family, { foreignKey: 'parent_family_id', as: 'parent' });

module.exports = { sequelize, ...models };
