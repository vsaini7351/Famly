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

  // User ↔ Family (many-to-many)
  User.belongsToMany(Family, { through: Membership, foreignKey: "user_id", as: "families" });
  Family.belongsToMany(User, { through: Membership, foreignKey: "family_id", as: "users" });

  // Family hierarchy
  Family.belongsTo(Family, { foreignKey: "parent_family_id", as: "parent" });
  Family.hasMany(Family, { foreignKey: "parent_family_id", as: "children" });

  // Root member
  Family.belongsTo(User, { foreignKey: "root_member", as: "rootUser" });
}
