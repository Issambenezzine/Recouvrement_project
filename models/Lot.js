const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');
const bcrypt = require('bcryptjs');

const Lot = sequelize.define('Lot', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    
  } , 
  Nlot:{
    type :DataTypes.STRING,
    allowNull: false
  } 
 
},{
    tableName: "lot", timestamps:false
  });



module.exports = Lot;
