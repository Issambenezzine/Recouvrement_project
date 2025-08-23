const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js'); // Assurez-vous que le chemin est correct
const Dossier = require('../models/Dossier.js')

const Creance = sequelize.define('Creance', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    capital: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    creance: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    solde : {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    duree: {
        type: DataTypes.INTEGER,
    },
    intRetard: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    autreFrais: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    date1Echeance: {
        type: DataTypes.DATE,
        allowNull: true
    },
    dateDEcheance: {
        type: DataTypes.DATE,
        allowNull: true
    },
    dateContentieux: {
        type: DataTypes.DATE,
        allowNull: true
    },
    duree: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    mensualite: {
        type: DataTypes.FLOAT,
        allowNull: true
    }
},{timestamps: true, tableName: "creance"});


module.exports = Creance;