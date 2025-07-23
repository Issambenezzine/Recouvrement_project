const {DataTypes} = require("sequelize")
const connection = require("../config/db.js")


const Debiteur_Conjoint = connection.define("Debiteur_Conjoint", {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    cin: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ville: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    addresse: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    conjoint_tel1: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    conjoint_tel2: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    debiteurId: {
        type: DataTypes.STRING,
        allowNull: false,
    }
},{timestamps: false,tableName: "debiteur_conjoint"})

module.exports = Debiteur_Conjoint