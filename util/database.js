const Sequelize= require('sequelize');
const sequelize= new Sequelize('expense-tracker','root','landaarun',{
    dialect : 'mysql',
    host: 'localhost'
});
module.exports= sequelize;
