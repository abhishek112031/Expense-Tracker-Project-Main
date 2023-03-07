const express=require('express');
const path=require('path');
const userController=require('../controllers/user');
const router=express.Router();
// const userAuth=require('../middleware/auth')


router.get('/user/sign-up',userController.getSignUpPage);
router.post('/user/sign-up',userController.postNewUserDetails);
router.get('/user/login',userController.getLogInPage);
router.post('/user/login',userController.postLogInDetails);

// router.get('/user/verify',userAuth,userController.verifyUser)







module.exports=router;