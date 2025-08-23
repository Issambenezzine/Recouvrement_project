const { DataTypes } = require("sequelize");
const connection = require("../config/db.js");

const Sort = connection.define(
  "Sort",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sortValue: {
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
    tableName: "Sort",
  }
);

module.exports = Sort;
