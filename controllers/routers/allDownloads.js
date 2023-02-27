const express=require('express');
const path=require('path');
const allDownloads=require('../controllers/allDownloads')

const userAuth=require('../middleware/auth');
const router=express.Router();

router.get('/downloads/all',userAuth,allDownloads.gellAllFiles)

module.exports=router;