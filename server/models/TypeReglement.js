const { DataTypes } = require("sequelize");
const connection = require("../config/db.js");

const TypeReglement = connection.define(
  "TypeReglement",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    typeReg: {
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
    tableName: "TypeReglement",
  }
);

module.exports = TypeReglement;
