const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js'); // Assurez-vous que le chemin est correct

const Debiteur_Patrimoine = sequelize.define('Debiteur_Patrimoine', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    ville: {
        type: DataTypes.STRING,
        allowNull: true
    },
    titre: {
        type: DataTypes.STRING,
        allowNull: true
    },
    NBRE_TF: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Nom: {
        type: DataTypes.STRING,
        allowNull: true
    },
    NomF: {
        type: DataTypes.STRING,
        allowNull: true
    },
    debiteurId: {
        type: DataTypes.STRING,
        require: true
    },
    H: {
        type:DataTypes.STRING,
        allowNull: true,
    },
    Are: {
        type:DataTypes.STRING,
        allowNull: true,
    },
    CA: {
        type:DataTypes.STRING,
        allowNull: true,
    },
    Quote: {
        type:DataTypes.STRING,
        allowNull: true,
    },
    Part: {
        type:DataTypes.STRING,
        allowNull: true,
    },
    Pdite: {
        type:DataTypes.STRING,
        allowNull: true,
    },
    AdrProp: {
        type:DataTypes.STRING,
        allowNull: true,
    },
    Consistance: {
        type:DataTypes.STRING,
        allowNull: true,
    },
    marche : {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
    
},{timestamps: true,tableName: "debiteur_patrimoine"});


module.exports = Debiteur_Patrimoine;