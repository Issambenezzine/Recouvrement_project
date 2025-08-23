const {DataTypes} = require("sequelize")
const connection = require("../config/db.js")

const Debiteur_Retraite = connection.define("Debiteur_Retraite", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    date_retraite: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    ancien_employeur: {
        type: DataTypes.STRING,
        allowNull: true, 
    },
    montant: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    regime_retraite: {
        type:DataTypes.FLOAT,
        allowNull: true,
    },
    type_retraite: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    debiteurId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    marche : {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
},{timestamps: true,tableName: "debiteur_retraite"})

module.exports = Debiteur_Retraite