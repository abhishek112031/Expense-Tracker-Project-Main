const express = require('express');

const resetpasswordController = require('../controllers/resetpassword');


const router = express.Router();

router.get('/password/forgotpassword',resetpasswordController.getForgotPasswordPage)
router.post('/password/forgotpassword',resetpasswordController.postEmailidToReceivePwLink);

router.get('/resetpassword/:id',resetpasswordController.createNewPassword);
router.get('/password/updatepassword/:resetPwid',resetpasswordController.updatePassword)

module.exports=router;
