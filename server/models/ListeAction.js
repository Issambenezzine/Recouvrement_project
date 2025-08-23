const {DataTypes} = require("sequelize")
const connection = require("../config/db.js")

const ListeAction = connection.define("ListeAction", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nomAction: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    familleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    visibility : {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
},{tableName:"liste_action", timestamps: false})

module.exports = ListeAction