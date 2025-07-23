const { DataTypes } = require("sequelize");
const connection = require("../config/db.js");

const Dossier = connection.define("Dossier", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  NDossier: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  categorie: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  commentaire: {type:DataTypes.STRING,allowNull:true},
  commentaire_responsable: {type:DataTypes.STRING, allowNull:true},
  creanceId: {
    type: DataTypes.BIGINT,
    unique: true,
  },
  debiteurId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  etat: {
    type: DataTypes.STRING,
    default: "Nouvelles ations",
    enum: [
      "Nouvelles ations",
      "Action à traiter",
      "Actions en backlog",
      "Actions en cours",
      "Actions suite au cadrage",
    ],
  },
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  statusId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  gestionnaireId: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  responsableId: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  lotId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  autre: {
    type: DataTypes.STRING,
    allowNull: true
  }
},{timestamps: true,tableName:"dossier"});

module.exports = Dossier;
