const Sequelize=require('sequelize');
const path=require('path');
const sequelize=require('../util/database');
const User=sequelize.define('user',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false,


    },
    emailId:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true

    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
        
    },
    isPremiumUser:Sequelize.BOOLEAN,

    totalExpenses:{
        type:Sequelize.INTEGER,
        defaultValue:0

    }


});
module.exports=User;