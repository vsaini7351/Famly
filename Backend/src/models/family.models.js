import { DataTypes, Model } from "sequelize";

class Family extends Model {
  static initModel(sequelize) {
    Family.init(
      {
        family_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        family_name: { type: DataTypes.STRING, allowNull: false },
        created_by: { type: DataTypes.INTEGER, allowNull: false },
        male_root_member: { type: DataTypes.INTEGER, allowNull: true },
        female_root_member: {type:DataTypes.INTEGER,allowNull:true},
        ancestor:{type:DataTypes.INTEGER,allowNull:true}, // ye lenge nhi ye male_root_member ke parent family ki id
        marriage_date:{type:DataTypes.DATEONLY , allowNull : false},
       invitation_code :{type:DataTypes.STRING , allowNull:false,unique:true},

        familyPhoto :{type : DataTypes.TEXT,allowNull:true},
        description: {type:DataTypes.TEXT,allowNull:true},

      },
      {
        sequelize,
        modelName: "Family",
        tableName: "families",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
      }
    );
    return Family;
  }
}

export default Family;
