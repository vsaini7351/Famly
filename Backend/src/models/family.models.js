const { DataTypes, Model } = require('sequelize');

class Family extends Model {
  static initModel(sequelize) {
    Family.init({
      family_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      family_name: { type: DataTypes.STRING, allowNull: false },
      created_by: { type: DataTypes.INTEGER, allowNull: false },
      root_member: { type: DataTypes.INTEGER, allowNull: true },
      parent_family_id: { type: DataTypes.INTEGER, allowNull: true },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    }, {
      sequelize,
      modelName: 'Family',
      tableName: 'families',
      timestamps: false
    });
    return Family;
  }
}

module.exports = Family;
