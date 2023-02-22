const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const Sequelize = require('sequelize');
const rootDir = require('./util/path');
const sequelize = require('./util/database');

//models:-->
const User=require('./models/user');
const Expense=require('./models/expenses');
const Order=require('./models/orders');
const Forgotpassword = require('./models/forgotPassword');
const DownloadedFile=require('./models/downloadedFile');


//routers:->
const userRoute=require('./routers/user');
const expenseRoute=require('./routers/expense');
const purchaseRoute=require('./routers/purchase');
const premiumFeatureRoute=require('./routers/premiumFeatures');
const resetPasswordRoute=require('./routers/resetPassword');
const downloadFilesRoute=require('./routers/allDownloads')

const app = express();


app.use(cors());
app.use(bodyParser.json({ extended: false }));


//main middlewares:-->
app.use(userRoute);
app.use(purchaseRoute);
app.use(premiumFeatureRoute);
app.use(expenseRoute);
app.use(resetPasswordRoute);
app.use(downloadFilesRoute);


//associations:-->>One to many
User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

//trial part:
User.hasMany(DownloadedFile);
DownloadedFile.belongsTo(User)



//db table sync/creation:-->
sequelize
    // .sync({force:true})
    .sync()
    .then(() => {
        app.listen(3000);
    })
    .catch(err=>{
        console.log(err)
    })
    