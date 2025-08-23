const {DataTypes} = require("sequelize")
const connection = require("../config/db.js")


const Debiteur_Employeur_Cadrage = connection.define("Debiteur_Employeur_Cadrage", {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    RS: {
        type: DataTypes.STRING,
        allowNull: false
    },
    AVT: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    AD_STE: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    V_STE: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    NUM_SAL: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    NM: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    PR: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    AD_SAL: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    V_SAL: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    PRD: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    JR: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    SLR: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ML: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    TL: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    debiteurId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    marche : {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
},{timestamps: false,tableName: "debiteur_employeur_cadrage"})

module.exports = Debiteur_Employeur_Cadrage
