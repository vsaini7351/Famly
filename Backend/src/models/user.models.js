const { DataTypes, Model } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class User extends Model {
  static initModel(sequelize) {
    User.init(
      {
        user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        fullname: { type: DataTypes.STRING, allowNull: false },
        username: { type: DataTypes.STRING, allowNull: false, unique: true },
        dob: { type: DataTypes.DATEONLY, allowNull: false },
        gender: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        phone_no: { type: DataTypes.STRING, allowNull: false},
        passwordHash: { type: DataTypes.STRING, allowNull: false },
        profilePhoto: { type: DataTypes.STRING, allowNull: false }, // store URL
        refreshToken: { type: DataTypes.STRING, allowNull: false },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
        updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
      },
      {
        sequelize,
        modelName: "User",
        tableName: "users",
        timestamps: false,
      }
    );

    // Hooks
    User.beforeCreate(async (user) => {
      user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
    });
    User.beforeUpdate(async (user) => {
      if (user.changed("passwordHash")) {
        user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
      }
    });

    return User;
  }

  // Instance Methods
  async isPasswordCorrect(password) {
    return await bcrypt.compare(password, this.passwordHash);
  }

  generateAccessToken() {
    return jwt.sign(
      { user_id: this.user_id, email: this.email, phone_no: this.phone_no },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
  }

  generateRefreshToken() {
    return jwt.sign(
      { user_id: this.user_id, email: this.email, phone_no: this.phone_no },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
  }
}

module.exports = User;
