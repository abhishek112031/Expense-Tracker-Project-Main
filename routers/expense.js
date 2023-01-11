const express=require('express');
const path=require('path');
// const userController=require('../controllers/user');
const expenseController=require('../controllers/expense');
const userAuth=require('../middleware/auth');
const router=express.Router();

router.get('/user/daily-expenses',expenseController.getExpensePage);
router.post('/user/add-daily-expenses',userAuth,expenseController.postAddExpense );
router.get('/user/all-expenses',userAuth,expenseController.getEachUserExpenses);
router.delete('/user/expenses/delete/:Id',userAuth,expenseController.deleteExpenseById);



module.exports=router;