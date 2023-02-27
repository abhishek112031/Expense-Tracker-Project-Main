const express=require('express');
const path=require('path');
const userController=require('../controllers/user');
const router=express.Router();


router.get('/user/sign-up',userController.getSignUpPage);
router.post('/user/sign-up',userController.postNewUserDetails);
router.get('/user/login',userController.getLogInPage);
router.post('/user/login',userController.postLogInDetails);







module.exports=router;