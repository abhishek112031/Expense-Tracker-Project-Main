const Expense=require('../models/expenses');
const User=require('../models/user');
const sequelize = require('../util/database');

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

//trial1:-->leaderboard
// exports.premiumLeaderBoard=async(req,res)=>{
//     try{
//       const users= await User.findAll({
//         attributes:['id','name','isPremiumUser']
//       });
//       const expenses= await Expense.findAll({
//         attributes:['userId','expenseAmount']
//       });
//       let user_exp={};
//       console.log(users);

//       expenses.forEach((exp)=>{
//         if(user_exp[exp.userId]){
//             user_exp[exp.userId]+=exp.expenseAmount;

//         }
       
//         else{
//             user_exp[exp.userId]=exp.expenseAmount;

//         }

//       });
//     //   console.log(user_exp);
//     // res.status(200).json(user_exp)
//     const userLeaderboardDetails=[];
    
//     users.forEach((eachUser)=>{
//         if(eachUser.isPremiumUser){

//             userLeaderboardDetails.push({Name:eachUser.name,Total_Expense:user_exp[eachUser.id] || 0})
//         }
  
//     });
//     // console.log(userLeaderboardDetails);
//     userLeaderboardDetails.sort((a,b)=>{
//         return (b.Total_Expense-a.Total_Expense);
//     });
   
//     res.status(200).json(userLeaderboardDetails);

//     }
//     catch(err){
//         console.log("err===>",err);
//     }
// }



//trial2:-->
// exports.premiumLeaderBoard=async(req,res)=>{
//     try{
//       const aggrigated_expenses= await User.findAll({
//         attributes:['id','name',[sequelize.fn('sum',sequelize.col('expenses.expenseAmount')),'Total_Expense']],
//         include:[
//             {
//                 model:Expense,
//                 attributes:[]
//             }
//         ],
//         group:['user.id'],
//         order:[['Total_Expense','DESC']]

//       });
   
    

//     res.status(200).json(aggrigated_expenses);

//     }
//     catch(err){
//         console.log("err===>",err);
//     }
// }

//trial:-3
exports.premiumLeaderBoard=async(req,res)=>{
    try{
      const aggrigated_expenses= await User.findAll({
       
        order:[['totalExpenses','DESC']]

      });
      console.log("exp-------->",aggrigated_expenses[0]);
 
    

    res.status(200).json(aggrigated_expenses);

    }
    catch(err){
        console.log("err===>",err);
    }
}