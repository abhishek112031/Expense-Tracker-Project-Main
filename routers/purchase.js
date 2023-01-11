const express=require('express');
const path=require('path');
const purchaseController=require('../controllers/purchase');
const userAuth=require('../middleware/auth');
const router=express.Router();

router.get('/user/purchase/premium-membership',userAuth,purchaseController.purchasePremium);
router.post('/user/purchase/updateTrasactionStatus',userAuth,purchaseController.updateTransactionStatus);
router.post('/user/purchase/updateTrasactionStatusFailed',userAuth,purchaseController.updateTransactionStatusFailed);


module.exports=router;