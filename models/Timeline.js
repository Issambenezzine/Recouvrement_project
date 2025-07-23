const { DataTypes } = require("sequelize");
const connection = require("../config/db.js");

const Timeline = connection.define("Timeline", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  status_timeline: {
    type: DataTypes.STRING,
    allowNull: false,
  },

}, {timestamps: true,tableName:"timeline"});


module.exports = Timeline;