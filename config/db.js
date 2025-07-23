
const Sequelize = require('sequelize');
require('dotenv').config();

const connection = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: process.env.DB_LOGGING === 'true',
  }
);

module.exports = connection;
