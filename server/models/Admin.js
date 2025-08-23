const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.js");
const bcrypt = require("bcryptjs");

const Admin = sequelize.define(
  "Admin",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: DataTypes.STRING,
    email: { type: DataTypes.STRING},
    password: DataTypes.STRING,
    activation: {
      type: DataTypes.ENUM("Active", "Block"),
      allowNull: true,
      defaultValue: "Active",
    },
    addresse: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tel: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "admin",
  }
);

Admin.beforeCreate(async (admin) => {
  admin.password = await bcrypt.hash(admin.password, 10);
});

module.exports = Admin;
