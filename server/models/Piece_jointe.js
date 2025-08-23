const { DataTypes } = require("sequelize");
const connection = require("../config/db.js");

const Piece_jointe = connection.define("Piece_jointe", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  commentaire: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  responsable: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  nomPiece: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  src_image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dateAjout: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  dossierId: {
    type: DataTypes.BIGINT,
    allowNull: true,
  }
}, {
  timestamps: true,tableName:"piece_jointe"
});


module.exports = Piece_jointe;
