const express=require('express');
const path=require('path');
// const userController=require('../controllers/user');
const expenseController=require('../controllers/expense');
const userAuth=require('../middleware/auth');
const router=express.Router();

router.get('/expenses/download',userAuth,expenseController.downloadExpense);

router.get('/user/daily-expenses',expenseController.getExpensePage);
router.post('/user/add-daily-expenses',userAuth,expenseController.postAddExpense );
router.get('/user/all-expenses',userAuth,expenseController.getEachUserExpenses);
router.get('/details',expenseController.getDetailsPage);
// router.post('/user/expense/edit/:expId',userAuth,expenseController.editExpense);
router.get('/user/total-expenses',userAuth,expenseController.totalExpenses)

router.delete('/user/expenses/delete/:Id',userAuth,expenseController.deleteExpenseById);



module.exports=router;