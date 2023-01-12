const express = require('express');

const resetpasswordController = require('../controllers/resetpassword');


const router = express.Router();

router.get('password/resetpassword/:id', resetpasswordController.resetpassword);
router.get('password/updatepassword/:resetpasswordid', resetpasswordController.updatepassword);

router.post('/password/forgotpassword',resetpasswordController.forgotpassword);
router.get('/password/forgotpassword',resetpasswordController.getForgotPasswordPage);

module.exports=router;
