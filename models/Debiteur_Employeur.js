const {DataTypes} = require("sequelize")
const connection = require("../config/db.js")


const Debiteur_Employeur = connection.define("Debiteur_Employeur", {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    employeur: {
        type: DataTypes.STRING,
        allowNull: false
    },
    addresse: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ville: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    employeur_tel1: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    employeur_tel2: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    debiteurId: {
        type: DataTypes.STRING,
        allowNull: true,
    }
},{timestamps: false,tableName: "debiteur_employeur"})

module.exports = Debiteur_Employeur
