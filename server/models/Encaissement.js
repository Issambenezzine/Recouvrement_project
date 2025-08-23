const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js'); // Assurez-vous que le chemin est correct

const Encaissement = sequelize.define('Encaissement', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    modeReg: {
        type: DataTypes.STRING,
        allowNull: true
    },
    typeReg: {
        type: DataTypes.STRING,
        allowNull: true
    },
    montant: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    dateReg: {
        type: DataTypes.DATE,
        allowNull: true
    },
    responsable: {
        type: DataTypes.STRING,
        allowNull: true
    },
    fileName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    dossierId: {
        type: DataTypes.BIGINT,
        require: true
    }
    
},{timestamps: true,tableName:"enaissement"});


module.exports = Encaissement;