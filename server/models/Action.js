const {DataTypes} = require("sequelize")
const connection = require("../config/db.js")

const Action = connection.define("Action", {
    id: {
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    familleAction: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    nouveauStatus : {
        type: DataTypes.STRING,
        allowNull: true
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    actionSuivante: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    detail: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dateExecution: {
        type: DataTypes.DATEONLY,
        allowNull:true,
    },
    dateActionSuivante: {
        type: DataTypes.DATEONLY,
        allowNull:true,
    },
    sort: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    dossierId: {
        type: DataTypes.BIGINT,
        allowNull: false,
    }
},{timestamps:true, tableName: "action"})

module.exports = Action