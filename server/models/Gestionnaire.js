const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.js");
const bcrypt = require("bcryptjs");

const Gestionnaire = sequelize.define(
  "Gestionnaire",
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
    objectif: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    responsableId: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    addresse : {
      type: DataTypes.STRING,
      allowNull: true
    },
    activation: {
      type: DataTypes.ENUM("Active", "Block"),
      allowNull: true,
      defaultValue: "Active",
    },
  },
  {
    tableName: "Gestionnaire",
    tableName: "gestionnaire",
  }
);

Gestionnaire.beforeCreate(async (gestionnaire, options) => {
  const salt = await bcrypt.genSalt(10);
  gestionnaire.password = await bcrypt.hash(gestionnaire.password, salt);
});

module.exports = Gestionnaire;
