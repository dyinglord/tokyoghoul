const { DataTypes } = require('sequelize'); 
const sequelize = require('../config/database'); 
 
const User = sequelize.define('User', { 
 id: { 
   type: DataTypes.INTEGER, 
   primaryKey: true, 
   autoIncrement: true 
 }, 
 name: { 
   type: DataTypes.STRING, 
   allowNull: false 
 }, 
 email: { 
   type: DataTypes.STRING, 
   allowNull: false, 
   unique: true, 
   validate: { 
     isEmail: true 
   } 
 } 
}, { 
   tableName: 'users', 
   timestamps: true, 
   underscored: true,  // This tells Sequelize to use snake_case 
   createdAt: 'created_at',  // Map to snake_case column 
   updatedAt: 'updated_at'   // Map to snake_case column 
}); 
 
module.exports = User;