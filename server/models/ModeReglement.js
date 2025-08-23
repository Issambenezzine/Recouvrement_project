const { DataTypes } = require("sequelize");
const connection = require("../config/db.js");

const ModelReglement = connection.define(
  "ModelReglement",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    modeReg: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    visibility: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    tableName: "ModelReglement",
  }
);

module.exports = ModelReglement;
