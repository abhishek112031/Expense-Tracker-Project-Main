const { Sequelize } = require("sequelize");
const dotenv=require('dotenv');
dotenv.config();

const sequelize=new Sequelize('expensetracker-final-2','root',`${process.env.DATABASE_PASSWORD}`,{
    dialect:'mysql',
    host:'localhost'
});

module.exports=sequelize;