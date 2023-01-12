const express=require('express');
const path=require('path');
const premiumFeatureController=require('../controllers/premiumFeature');
const userAuth=require('../middleware/auth');
const router=express.Router();

router.get('/premium-user',userAuth,premiumFeatureController.premiumUser);
router.get('/premium/leader-board',userAuth,premiumFeatureController.premiumLeaderBoard);
router.get('/user/premium/expense-timeframe',premiumFeatureController.getExpenseOnTimeFramePage)

module.exports=router;