const path = require('path');
// const fs=require('fs');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const Sequelize = require('sequelize');
const rootDir = require('./util/path');
const sequelize = require('./util/database');
// const helmet=require('helmet');
// const compression=require('compression');
// const morgan=require('morgan');

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
const downloadFilesRoute=require('./routers/allDownloads');

const app = express();
// const accessLogStream=fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'});//login data saving inside a file

//other middlewares:-->>

app.use(cors());
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.json({ extended: false }));
app.use(bodyParser.urlencoded({extended:false}))
// app.use(helmet());//getting blocked
// app.use(compression());
// app.use(morgan('combined',{stream:accessLogStream}));//user loging data


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


// console.log(process.env.NODE_ENV);
//db table sync/creation:-->
sequelize
    // .sync({force:true})
    .sync()
    .then(() => {
        app.listen(process.env.PORT || 4000);
    })
    .catch(err=>{
        console.log(err)
    })
    