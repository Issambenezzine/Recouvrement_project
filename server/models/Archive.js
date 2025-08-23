const { DataTypes } = require("sequelize");
const connection = require("../config/db.js");

const Archive = connection.define("Archive", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  dossierId: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
}, {timestamps: false, tableName: "archive"});


module.exports = Archive;