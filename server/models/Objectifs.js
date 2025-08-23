const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.js");
const bcrypt = require("bcryptjs");

const Objectifs = sequelize.define(
  "Objectifs",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    gestionnaireId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    newObjectif: {
      type: DataTypes.FLOAT,
      allowNull: false,
    }
  },
  {
    tableName: "Objectifs",
    timestamps: true,
  }
);

module.exports = Objectifs;
