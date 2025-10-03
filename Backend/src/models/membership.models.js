import { DataTypes, Model } from "sequelize";

class Membership extends Model {
  static initModel(sequelize) {
    Membership.init(
      {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        family_id: { type: DataTypes.INTEGER, allowNull: false },
        user_id: { type: DataTypes.INTEGER, allowNull: false },
        role: { type: DataTypes.STRING, allowNull: false, defaultValue: "member" },
        joined_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      },
      {
        sequelize,
        modelName: "Membership",
        tableName: "memberships",
        timestamps: false,
        indexes: [
          { unique: true, fields: ["family_id", "user_id"] },
        ],
      }
    );
    return Membership;
  }
}

export default Membership;
