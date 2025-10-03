import User from "./user.models.js";
import Family from "./family.models.js";
import Membership from "./membership.models.js";

export default function setupAssociations() {
  // Family ↔ Membership
  Family.hasMany(Membership, { foreignKey: "family_id", as: "memberships" });
  Membership.belongsTo(Family, { foreignKey: "family_id", as: "family" });

  // User ↔ Membership
  User.hasMany(Membership, { foreignKey: "user_id", as: "memberships" });
  Membership.belongsTo(User, { foreignKey: "user_id", as: "user" });

  // User ↔ Family (many-to-many via Membership)
  User.belongsToMany(Family, { through: Membership, foreignKey: "user_id", otherKey: "family_id", as: "families" });
  Family.belongsToMany(User, { through: Membership, foreignKey: "family_id", otherKey: "user_id", as: "users" });

  // Family hierarchy (self-referencing with ancestor)
  Family.belongsTo(Family, { foreignKey: "ancestor", as: "ancestorFamily" });
  Family.hasMany(Family, { foreignKey: "ancestor", as: "descendants" });

  // Root members
  Family.belongsTo(User, { foreignKey: "male_root_member", as: "maleRoot" });
  Family.belongsTo(User, { foreignKey: "female_root_member", as: "femaleRoot" });

  // User ↔ Family direct link (parent_family in User)
  User.belongsTo(Family, { foreignKey: "parent_family", as: "parentFamily" });
  Family.hasMany(User, { foreignKey: "parent_family", as: "familyMembers" });
}
