const { DataTypes } = require("sequelize");
const connection = require("../config/db.js");
const Dossier = require('../models/Dossier.js')

const Debiteur = connection.define('Debiteur', {
  CIN: {
    type: DataTypes.STRING,
    allowNull:false,
    primaryKey: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  profession: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  date_naissance: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  debiteur_tel1: {
    type: DataTypes.STRING,
    allowNull: true
  },
  debiteur_tel2: {
    type: DataTypes.STRING,
    allowNull: true
  },
},{timestamps: true,tableName: "debiteur"});

module.exports = Debiteur;
