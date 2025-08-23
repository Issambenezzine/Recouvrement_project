const {DataTypes} = require("sequelize")
const connection = require("../config/db.js")


const FamilleAction = connection.define("FamilleAction", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    familleAction: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    visibility : {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
},{tableName:"famille_action", timestamps: false})

module.exports = FamilleAction