const { Sequelize } = require("sequelize");
const dotenv=require('dotenv');
dotenv.config();

const sequelize=new Sequelize(process.env.DATABASE_SCHEMA,process.env.DB_USER,`${process.env.DATABASE_PASSWORD}`,{
    dialect:process.env.DB_NAME,
    host: process.env.HOST
});

module.exports=sequelize;