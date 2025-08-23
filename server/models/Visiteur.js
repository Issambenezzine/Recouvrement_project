const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.js");
const bcrypt = require("bcryptjs");

const Visiteur = sequelize.define(
  "Visiteur",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: DataTypes.STRING,
    email: { type: DataTypes.STRING},
    password: DataTypes.STRING,
    activation: {
      type: DataTypes.ENUM("Active", "Block"),
      allowNull: true,
      defaultValue: "Active",
    },
    addresse: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tel: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "visiteur",
  }
);

Visiteur.beforeCreate(async (visiteur) => {
  visiteur.password = await bcrypt.hash(visiteur.password, 10);
});

module.exports = Visiteur;
