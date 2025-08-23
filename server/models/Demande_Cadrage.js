const { DataTypes } = require("sequelize");
const connection = require("../config/db.js");

const DemandeCadrage = connection.define("Demande_Cadrage", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nature: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  date_demande: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  date_retour: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  date_confirmation: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING, // ou ENUM si les statuts sont limités (ex: ['en_attente', 'confirmée', 'refusée'])
    allowNull: false,
    enum:["CONFIRMEE","GENEREE","REALISEE","REFUSEE","EN ATTENTE"],
  },
  dossierId: {
    type: DataTypes.BIGINT,
    allowNull: false,
  }
}, {
  tableName: "Demande_Cadrage",
  timestamps: true, // Si tu ne veux pas les colonnes createdAt / updatedAt
});

module.exports = DemandeCadrage;
