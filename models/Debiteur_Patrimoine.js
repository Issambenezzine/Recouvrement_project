const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js'); // Assurez-vous que le chemin est correct

const Debiteur_Patrimoine = sequelize.define('Debiteur_Patrimoine', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    conservation: {
        type: DataTypes.STRING,
        allowNull: true
    },
    titreFoncier: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nbrTitre: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    source: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true
    },
    debiteurId: {
        type: DataTypes.STRING,
        require: true
    },
    action: {
        type:DataTypes.STRING,
        allowNull: true,
    }
    
},{timestamps: true,tableName: "debiteur_patrimoine"});


module.exports = Debiteur_Patrimoine;