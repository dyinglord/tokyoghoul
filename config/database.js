const { Sequelize } = require('sequelize'); 
 
const sequelize = new Sequelize({ 
 dialect: 'sqlite', 
 storage: './database.sqlite', // path to the .sqlite file on disk 
 logging: console.log, 
}); 
 
module.exports = sequelize;