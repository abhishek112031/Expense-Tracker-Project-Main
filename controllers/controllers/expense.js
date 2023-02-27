const path=require('path');
const rootDir=require('../util/path');
const Expense=require('../models/expenses');
const User=require('../models/user');
const DownloadedFile=require('../models/downloadedFile')
const sequelize = require('../util/database');
const UserServices=require('../services/userservices');
const S3Services=require('../services/S3services');


const dotenv=require('dotenv');
dotenv.config();

function invalidInput(input) {
    if (input === undefined || input.length === 0) {
        return true;
    }
    else {
        return false;
    }
}
exports.downloadExpense=async (req,res,next)=>{
  
    try{
  
      // console.log("fileurl===>>",fileUrl)
      
      if(req.user.isPremiumUser){
        const expenses=await UserServices.getExpenses(req);
        // console.log(expenses);
      
        const stringifiedExpenses=JSON.stringify(expenses);
      
        //file name should be depend upon user id,who is going to dwnld:
        let userId=req.user.id;
        const fileName=`expense${userId}/${new Date()}.txt`;
        const fileUrl= await S3Services.uploadToS3(stringifiedExpenses,fileName);//async function

        DownloadedFile.create({

            url:fileUrl,
            userId:req.user.id

        })
      
  
        return res.status(200).json({fileUrl,success:true});
  
      }
      
      return res.status(500).json({message:"Please Update to Premium to Fascilate this functionality!",success:false});
    
    
    }
    catch(err){
    //   console.log("s3 error--->>",err)
      res.status(500).json({message:"something went wrong! ",success:false});
    }
}

exports.getExpensePage=(req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'daily-expenses.html'));
};

// exports.postAddExpense=async(req, res, next) => {

//     const t=await sequelize.transaction()

//     const expenseAmount = req.body.expenseAmount;
//     const description = req.body.description;
//     const category = req.body.category;
//     // console.log("prinnnnt---->", expenseAmount)

//     Expense.create({
//             expenseAmount: expenseAmount,
//             description: description,
//             category: category,
//             userId:req.user.id
            
//         },
//         {
//             transaction:t
//         })
//         .then((eachExp) => {
//             const totalExpense=Number(req.user.totalExpenses)+Number(expenseAmount);
//             console.log(totalExpense);
//             User.update({totalExpenses:totalExpense},{where:{id:req.user.id},transaction:t})
//             .then(async()=>{
//                 await t.commit() //update the database

//                 res.status(201).json(eachExp);
//             })
//             .catch(async(err) => {
//                await t.rollback();
//               return  res.status(500).json({ error: err });
    
//             })
//         })


//         .catch(async(err) => {
//             await t.rollback();
//             return  res.status(500).json({ error: err });
//         })

// };

exports.postAddExpense=async(req, res, next) => {

    try{

        const t=await sequelize.transaction()
        const {expenseAmount,description,category}=req.body;
        if (invalidInput(expenseAmount) || invalidInput(description) ||invalidInput(category)) {
            return res.status(400).json({ message: 'input can not be empty or undefined' })
        }
        const eachExp= await Expense.create({
            expenseAmount: expenseAmount,
            description: description,
            category: category,
            userId:req.user.id
            
        },
        {
            transaction:t
        });

        const totalExpense=Number(req.user.totalExpenses)+Number(expenseAmount);

        await  User.update({totalExpenses:totalExpense},{where:{id:req.user.id},transaction:t});
        
        await t.commit() //update the database

        res.status(201).json(eachExp);
    }
    catch(err){
        await t.rollback();
        return  res.status(500).json({ error: err });

    }
};
exports.getEachUserExpenses=async (req,res,next)=>{
    try{
        const allExp=await Expense.findAll({where:{userId:req.user.id}}); // or
        // const userWiseExp=await req.user.userExpenses();
        res.status(200).json(allExp);
    }
    catch(err){
        res.status(500).json({error:err});
    }
}
// exports.deleteExpenseById=(req,res,next)=>{
//     const eachExpId=req.params.Id;
//     if (eachExpId===undefined || eachExpId.length===0){
//         return res.status(400).json({success:false});
//     }

//     //trial:-->
//     Expense.findOne({where:{id:eachExpId}})
//     .then(exp=>{
//         const totalExpense=Number(req.user.totalExpenses)-Number(exp.expenseAmount);
//         User.update({totalExpenses:totalExpense},{where:{id:req.user.id}})
//         .then(()=>{

//             Expense.destroy({where:{id:eachExpId,userId:req.user.id}})
//             .then(noOfRows=>{
//                 if(noOfRows===0){
//                     return res.status(404).json({success:false,message:"Expense doesnot belongs to this user!"});
//                 }
//                 return res.status(200).json({success:true,message:'Expense is deleted successfully!!'});
//             })
//             .catch(err=>{
//                return  res.status(400).json({success:false,message:'Failed'});
//             });
//         })

//     })
    
  
// }

exports.deleteExpenseById= async(req,res,next)=>{
    try{
        const t=await sequelize.transaction();

        const eachExpId=req.params.Id;
        if (eachExpId===undefined || eachExpId.length===0){
            return res.status(400).json({success:false});
        }

        const exp=await Expense.findOne({where:{id:eachExpId}});
        const totalExpense=Number(req.user.totalExpenses)-Number(exp.expenseAmount);
        await User.update({totalExpenses:totalExpense},{where:{id:req.user.id},transaction:t},);

        const noOfRows= await Expense.destroy({where:{id:eachExpId,userId:req.user.id},transaction:t});
        if(noOfRows===0){
            return res.status(404).json({success:false,message:"Expense doesnot belongs to this user!"});
        }
        await t.commit()
        return res.status(200).json({success:true,message:'Expense is deleted successfully!!'});

    }
    catch(err){
        await t.rollback();
        return  res.status(400).json({success:false,message:'Failed'});

    }
 
}
exports.getDetailsPage=(req,res)=>{
    res.sendFile(path.join(rootDir,'views','all-details.html'));
}