const { DataTypes } = require("sequelize");
const connection = require("../config/db.js");
const Dossier = require('../models/Dossier.js')

const Debiteur_Cautionneur = connection.define('Debiteur_Cautionneur', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  CIN: {
    type: DataTypes.STRING,
    allowNull:true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  addresse: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ville: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cautionneurTel1: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cautionneurTel2: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  debiteurId: {
    type: DataTypes.STRING,
    allowNull: false,
  }
},{timestamps: false, tableName: "debiteur_cautionneur"});

module.exports = Debiteur_Cautionneur;
