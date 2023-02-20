const path = require('path');
const rootDir = require('../util/path');

const uuid = require('uuid');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config()

//models:-->
const User = require('../models/user');
const Forgotpassword = require('../models/forgotPassword');

//forgot password:-->
exports.getForgotPasswordPage = (req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'forgot-password.html'));
}
exports.postEmailidToReceivePwLink = (req, res, next) => {
    const email = req.body.email;

    User.findOne({ where: { emailId: email } })
        .then(user => {
            if (user) {
                // console.log("user--->>>",user);
                const id = uuid.v4();
                user.createForgotpassword({ id, active: true })
                    .catch(err => {
                        throw new Error(err);
                    })
                //nodemailer functionalities:--->
                let mailTransporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: "abhishek.112031@gmail.com",
                        pass: "ytybfsxbcvcuxxla"
                    }
                });

                let details = {
                    from: "abhishek.112031@gmail.com",
                    to: email,
                    subject: 'Expense-Tracker :Reset Password link',
                    text: 'click on the link',
                    html: `<a href="http://localhost:3000/resetpassword/${id}">Reset password</a>`
                }
                mailTransporter.sendMail(details, (err) => {
                    if (err) {
                        return res.status(404).json({ message: 'Something went wrong!!' })
                    }
                    else {
                        res.status(201).json({ message: 'Reset password link sent to your email Id' })
                    }
                });
            }
            else {
                res.status(404).json({ message: 'User does not exist!' })

            }


        })
        .catch(err => {

            res.status(404).json({ message: 'user does not exist' })
        })

}
exports.createNewPassword=(req,res,next)=>{
    const id=req.params.id;
    console.log("id--->",id)

    Forgotpassword.findOne({where:{id}})
    .then((forgotpw)=>{
        if(forgotpw){
            console.log(forgotpw)
                forgotpw.update({ active: false });

                res.status(200).send(`<html>
            <script>
                function formsubmitted(e){
                    e.preventDefault();
                    console.log('called')
                }
            </script>
            <form action="/password/updatepassword/${id}" method="get">
                <label for="newpassword">Enter New password</label>
                <input name="newpassword" type="password" required></input>
                <button>reset password</button>
            </form>
        </html>`
                )
                res.end()
        }
    })
}
exports.updatePassword = (req, res, next) => {
    const { newpassword } = req.query;
    const { resetPwid } = req.params;

    Forgotpassword.findOne({ where: { id: resetPwid } })
        .then((resetpwReq) => {
            User.findOne({ where: { id: resetpwReq.userId } })
                .then(user => {
                    if (user) {
                        bcrypt.hash(newpassword, 10, function (err, hash) {
                            if (err) {
                                throw new Error(err);
                            }
                            user.update({ password: hash })
                                .then(() => {
                                    res.status(201).json({ message: 'Successfuly update the new password' });
                                })
                        })
                    }
                    else {
                        return res.status(404).json({ error: 'No user Exists', success: false })
                    }
                })

        })
}





