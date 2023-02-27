const Expense=require('../models/expenses');
const User=require('../models/user');
const sequelize = require('../util/database');
const rootDir=require('../util/path');
const path=require('path');


exports.premiumUser=async (req,res)=>{
    try{

   if(req.user.isPremiumUser){
    return res.status(200).json({success:true,message:'You Are A Premium User' ,name:req.user.name})
   }


}
catch(err){
    res.status(500).json(err);
}

};
exports.premiumLeaderBoard=async(req,res)=>{
    try{
      const aggrigated_expenses= await User.findAll({
       
        order:[['totalExpenses','DESC']]

      });
      res.status(200).json(aggrigated_expenses);

    }
    catch(err){
        // console.log("err===>",err);
        res.status(500).json({message:"something went wrong!"});

    }
}

