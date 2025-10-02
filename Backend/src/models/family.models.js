const { DataTypes, Model } = require('sequelize');

class Family extends Model {
  static initModel(sequelize) {
    Family.init({
      family_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      family_name: { type: DataTypes.STRING, allowNull: false },
      created_by: { type: DataTypes.INTEGER, allowNull: false },
      root_member: { type: DataTypes.INTEGER, allowNull: true },
      parent_family_id: { type: DataTypes.INTEGER, allowNull: true },
     
    }, {
      sequelize,
      modelName: 'Family',
      tableName: 'families',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });
    return Family;
  }
}

module.exports = Family;
