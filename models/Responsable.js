const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.js");
const bcrypt = require("bcryptjs");

const Responsable = sequelize.define(
  "Responsable",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateEmb: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    tel: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    activation: {
      type: DataTypes.ENUM("Active", "Block"),
      allowNull: true,
      defaultValue: "Active",
    },
  },
  {
    tableName: "responsable",
  }
);

Responsable.beforeCreate(async (responsable, options) => {
  const salt = await bcrypt.genSalt(10);
  responsable.password = await bcrypt.hash(responsable.password, salt);
});

module.exports = Responsable;
