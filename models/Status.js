const { DataTypes } = require("sequelize");
const connection = require("../config/db.js");

const Status = connection.define("Status", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  statusValue: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false,tableName:"Statut"
});


module.exports = Status;
