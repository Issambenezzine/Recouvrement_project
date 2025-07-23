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
    }
},{tableName:"liste_action"})

module.exports = ListeAction