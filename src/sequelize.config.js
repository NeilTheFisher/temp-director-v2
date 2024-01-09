// sequelize.config.js
const { Sequelize } = require('sequelize')

const sequelize = new Sequelize({
	dialect: 'mariadb', // Use the appropriate dialect for your database
	host: process.env.MYSQL_SOCKET_ADDRESS,
	username: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE,
})

module.exports = sequelize
