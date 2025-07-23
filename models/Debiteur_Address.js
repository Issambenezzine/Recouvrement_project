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
    debiteurId: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {timestamps: false,tableName: "debiteur_addresse"})

module.exports = Debiteur_Addresse