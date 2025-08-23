const { DataTypes } = require("sequelize");
const connection = require("../config/db.js");

const PilotageCommission = connection.define("PilotageCommission", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  encaissMois: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  comMois: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  encaissQuotid: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  comQuotid: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
},{timestamps: true,tableName:"pilotage_commission"});
module.exports = PilotageCommission;
