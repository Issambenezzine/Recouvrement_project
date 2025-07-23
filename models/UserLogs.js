const connection = require("../config/db.js")
const {DataTypes} = require("sequelize")

const UserLogs = connection.define("UserLog", {
  user: DataTypes.STRING,
  action: DataTypes.ENUM("Se connecter","Se déconnecter","Autoriser","Banner"), // e.g., login/logout
  timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  userRole: DataTypes.ENUM("GESTIONNAIRE","RESPONSABLE"),
},{
  timestamps: false,tableName:"UserLogs"
});

module.exports = UserLogs
