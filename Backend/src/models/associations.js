function setupAssociations(sequelize) {
  const { User, Family, Membership } = sequelize.models;

  // Family ↔ Membership
  Family.hasMany(Membership, { foreignKey: 'family_id', as: 'memberships' });
  Membership.belongsTo(Family, { foreignKey: 'family_id', as: 'family' });

  // User ↔ Membership
  User.hasMany(Membership, { foreignKey: 'user_id', as: 'memberships' });
  Membership.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  // Many-to-many: User ↔ Family
  User.belongsToMany(Family, { through: Membership, foreignKey: 'user_id', as: 'families' });
  Family.belongsToMany(User, { through: Membership, foreignKey: 'family_id', as: 'users' });

  // Family hierarchy
  Family.belongsTo(Family, { foreignKey: 'parent_family_id', as: 'parent' });
  Family.hasMany(Family, { foreignKey: 'parent_family_id', as: 'children' });

  // Root member
  Family.belongsTo(User, { foreignKey: 'root_member', as: 'rootUser' });
}

module.exports = setupAssociations;
