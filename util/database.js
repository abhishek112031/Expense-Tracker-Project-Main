const { Sequelize } = require("sequelize");

const sequelize=new Sequelize('expensetracker-final-2','root','mysql@2022',{
    dialect:'mysql',
    host:'localhost'
});

module.exports=sequelize;