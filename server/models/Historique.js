const { DataTypes } = require("sequelize");
const connection = require("../config/db.js");

const Historique = connection.define(
  "Historique",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    debiteur_ID: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nature: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date_demande: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    date_retour: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    date_confirmation: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { tableName: "Historique", timestamps: false }
);

module.exports = Historique;
