const {DataTypes} = require("sequelize")
const connection = require("../config/db.js")

const Action = connection.define("Action", {
    id: {
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    famille_action: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    reference: {
        type:DataTypes.STRING,
        allowNull: true,
    },
    date_affectation: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    date_execution: {
        type: DataTypes.DATE,
        allowNull:true,
    },
    date_action_prevu: {
        type: DataTypes.DATE,
        allowNull:true,
    },
    sort: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    commentaire: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    commentaire_responsable: {
        type: DataTypes.STRING,
    },
    dossierId: {
        type: DataTypes.BIGINT,
        allowNull: false,
    }
},{timestamps:true, tableName: "action"})

module.exports = Action