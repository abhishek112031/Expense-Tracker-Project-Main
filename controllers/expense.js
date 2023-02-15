
const path=require('path');
const rootDir=require('../util/path');
const Expense=require('../models/expenses');
const User=require('../models/user')



exports.getExpensePage=(req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'daily-expenses.html'));
};
// exports.postAddExpense=(req, res, next) => {

//     const expenseAmount = req.body.expenseAmount;
//     const description = req.body.description;
//     const category = req.body.category;
//     // console.log("prinnnnt---->", expenseAmount)

//     req.user.createExpense({
//             expenseAmount: expenseAmount,
//             description: description,
//             category: category,
            
//         })
//         .then((eachExp) => {
//             res.status(201).json(eachExp);
//         })


//         .catch((err) => {
//             res.status(500).json({ error: err });

//         })

// };

exports.postAddExpense=(req, res, next) => {

    const expenseAmount = req.body.expenseAmount;
    const description = req.body.description;
    const category = req.body.category;
    // console.log("prinnnnt---->", expenseAmount)

    Expense.create({
            expenseAmount: expenseAmount,
            description: description,
            category: category,
            userId:req.user.id
            
        })
        .then((eachExp) => {
            const totalExpense=Number(req.user.totalExpenses)+Number(expenseAmount);
            console.log(totalExpense);
            User.update({totalExpenses:totalExpense},{where:{id:req.user.id}})
            .then(()=>{

                res.status(201).json(eachExp);
            })
            .catch((err) => {
                res.status(500).json({ error: err });
    
            })
        })


        .catch((err) => {
            res.status(500).json({ error: err });

        })

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
exports.deleteExpenseById=(req,res,next)=>{
    const eachExpId=req.params.Id;
    if (eachExpId===undefined || eachExpId.length===0){
        return res.status(400).json({success:false});
    }

    //trial:-->
    Expense.findOne({where:{id:eachExpId}})
    .then(exp=>{
        const totalExpense=Number(req.user.totalExpenses)-Number(exp.expenseAmount);
        User.update({totalExpenses:totalExpense},{where:{id:req.user.id}})
        .then(()=>{

            Expense.destroy({where:{id:eachExpId,userId:req.user.id}})
            .then(noOfRows=>{
                if(noOfRows===0){
                    return res.status(404).json({success:false,message:"Expense doesnot belongs to this user!"});
                }
                return res.status(200).json({success:true,message:'Expense is deleted successfully!!'});
            })
            .catch(err=>{
               return  res.status(400).json({success:false,message:'Failed'});
            });
        })

    })
    
  
}