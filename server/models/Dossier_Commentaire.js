const { DataTypes } = require("sequelize");
const connection = require("../config/db.js");

const Dossier_Commentaire = connection.define("Dossier_Commentaire", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  contenu: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date_commentaire: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dossierId: {
    type: DataTypes.BIGINT,
    allowNull: false,
  }
}, {timestamps: true, tableName:"dossier_commentaire"});


module.exports = Dossier_Commentaire;