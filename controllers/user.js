const path=require('path');
const rootDir=require('../util/path');
const User=require('../models/user');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');
dotenv.config()

function invalidInput(input) {
    if (input === undefined || input.length === 0) {
        return true;
    }
    else {
        return false;
    }
}
function generateAccessToken(id,name){
    return jwt.sign({userId:id,name:name},process.env.SECRET_TOKEN_KEY)
}



exports.getSignUpPage = (req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'signUp.html'));
}
exports.postNewUserDetails = (req, res, next) => {

    const user = req.body.user;
    const email = req.body.email;
    const password = req.body.password;
    if (invalidInput(email) || invalidInput(password) || invalidInput(user)) {
        return res.status(400).json({ message: 'input can not be empty or undefined' });
    }

    // User.findAll({where:{emailId:email}})
    // .then(user=>{
    //     if(user[0].emailId===email){
    //         return res.status(500).json({
    //             message:"email id already exist"
    //         })
    //     }
    // });
    bcrypt.hash(password, 10, (err, hash) => {

        User.create({
            name: user,
            emailId: email,
            password: hash
        })
            .then(() => {

                res.status(201).json({ message: 'user is created successfully', success: true })
            })
            .catch(err => {
                res.status(500).json({ message: "email id already exist", success: false });

            })
    })



}
exports.getLogInPage = (req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'login.html'));
}
exports.postLogInDetails = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    if (invalidInput(email) || invalidInput(password)) {
        return res.status(400).json({ message: 'input can not be empty or undefined' })
    }
    User.findAll({ where: { emailId: email } })
        .then(user => {
            if (user.length > 0) {
                bcrypt.compare(password, user[0].password, (err, result) => {
                    if (err) {
                        res.status(500).json({ success: false, message: 'something went wrong!' })

                    }
                    if (result === true) {
                        res.status(200).json({ success: true, message: 'Logged in successful', token: generateAccessToken(user[0].id, user[0].name) })
                    }
                    else {
                        return res.status(400).json({ success: false, message: 'Incorrect Password! Please refresh the page and Enter again' })

                    }
                });
            }
            else {
                return res.status(404).json({ success: false, message: 'user does not exist' })

            }


        })
        .catch(err => {
            res.status(500).json({ message: err, success: false })
        })


};

