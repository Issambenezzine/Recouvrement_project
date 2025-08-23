const {DataTypes} = require("sequelize")
const connection = require("../config/db.js")

const Debiteur_Addresse = connection.define("Debiteur_Addresse", {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    addresseDebiteur: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ville: {
        type: DataTypes.STRING,
        allowNull: true
    },
    debiteurId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    marche : {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {timestamps: false,tableName: "debiteur_addresse"})

module.exports = Debiteur_Addresse