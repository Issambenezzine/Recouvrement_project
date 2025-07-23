const { DataTypes } = require("sequelize");
const connection = require("../config/db.js");

const Client = connection.define("Client", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  marche: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  commissione: {
    type: DataTypes.INTEGER,
  }

}, {timestamps: false, tableName: "client"});


module.exports = Client;
