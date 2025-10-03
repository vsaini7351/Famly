// import {sequelize} from '../db/index.js';
// import UserModel from './user.models.js';
// import FamilyModel from './family.models.js';
// import MembershipModel from './membership.models.js';
// import setupAssociations from './associations.js';

// // Initialize models
// export const User = UserModel.initModel(sequelize);
// export const Family = FamilyModel.initModel(sequelize);
// export const Membership = MembershipModel.initModel(sequelize);

// // Setup associations
// setupAssociations(sequelize);

// // Export
// export {sequelize};

import UserModel from "./user.models.js";
import FamilyModel from "./family.models.js";
import MembershipModel from "./membership.models.js";
import setupAssociations from "./associations.js";
import { sequelize } from "../db/index.js";

// Initialize models
export const User = UserModel.initModel(sequelize);
export const Family = FamilyModel.initModel(sequelize);
export const Membership = MembershipModel.initModel(sequelize);

// Setup associations
setupAssociations(sequelize);

