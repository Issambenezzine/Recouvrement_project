const {DataTypes} = require("sequelize")
const connection = require("../config/db.js")

const Debiteur_Banque = connection.define("Debiteur_Banque", {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    debiteurId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    solde: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    Tel_Domicile: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    RIB: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    Date_mouvement: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    marche : {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
}, {timestamps: false,tableName: "debiteur_banque"})

module.exports = Debiteur_Banque