const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')


router.post('/userLogin', (req, res) => {
    const data = req.body;

    if (data) {
        req.con.query(`SELECT * FROM users WHERE userEmail = '${data.email}' AND userPassword = '${data.password}'`, (error, results) => {
            if (results[0] != null) {

                res.send({ "status": true, "message": "login successfull!", data: results});
            } else {
                res.send({ "status": false, "message": 'Incorrect Username and/or Password!' });
            }
        })
    } else {
        res.send('Please enter Username and Password!');
        res.end();
    }
})

router.get('/logout', (req, res) => {
    req.session.loggedin = false;
    res.redirect('/');
})




router.post('/createUser', function (req, res) {
    
        const data = req.body
        req.con.query(`select * from users where userEmail = '${data.errormail}'`, (error, results) => {
            if(results[0] != null) {
                res.send({"status":true, "message":"User Already Created"});
            } else {
                req.con.query(`INSERT INTO users SET userName = '${data.name}', userEmail = '${data.email}', userPassword = '${data.password}'`, (error, results) => {
                    if(results) {
                        res.send({"status":true, "message":"User created successfully"});
                    } else {
                        res.send({"status":false, "message":"Error creating user"});
                    } 
                })
            } 

        });


       /* req.con.query(`INSERT INTO users SET userName = '${data.userName}', userEmail = '${data.userEmail}', userPassword = '${data.userPassword}'`, (error, results) => {
            if(results) {
                res.send({"status":true, "message":"User created successfully"});
            } else {
                res.send({"status":false, "message":"Error creating user"});
            } 
        })*/
    });

    router.post('/forgot-password', (req, res, next) => {
        const email = req.body.email;
        req.con.query(`SELECT * FROM users WHERE userEmail='${email}'`,(error, results)=> {
            if(results[0] == null) {
                res.send({"status":false, "message":"Incorrect email!"});
            }
            else {
                const payload = {
                    email: results[0].userEmail
                }
        
                const expiryTime = 300;
                const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expiryTime })
        
                /*const newToken = new UserToken({
                    userId: user[0].id,
                    token: token
                });
                const createdAt= {
                    type: Date,
                    default: Date.now,
                    expires: 300
                }*/
        
                const mailTransporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: "sabarism2007@gmail.com",
                        pass: "djmhnvgizfdqrkjg"
                    }
                })
                console.log(token)
                let mailDetails = {
                    from: "sabarism2007@gmail.com",
                    to: email,
                    subject: "Reset Password",
                    html: `
                    <html>
                    <head>
                        <title>Password Reset Request</title>
                    </head>
                    <body>
                        <h1>Password Reset Request</h1>
                        <p>We have received a request to reset your password. Pleace click on the button below:</p>
                        <a href=${process.env.LIVE_URL}/reset/${token}><button style="background-color: #4CAF50; color:white; padding: 14px 20px; border: none;
                        cursor: pointer; border-radius: 4px;">Reset Password</button></a>
                        <p>By Surendar</p>
                    </body>
                    </html>`,
                }

                mailTransporter.sendMail(mailDetails, async(err,data) => {
                    if(err) {
                        console.log(err);
                        res.send({"status":false, "message":"Error!"});
                    } else {
                        req.con.query(`UPDATE users SET token = '${token}' WHERE userEmail = '${email}'`, (error, results) => {  
                            if(results) {
                                res.send({"status":true, "message":"sending!"});
                            } else if(error) {
                                console.log(error)
                            }
                        })
                        
                    }
                })
            }
        })
    })
    
    router.post('/reset-password',  async(req,res,next) => {
        
        const token = req.body.token;
        const newPassword = req.body.password;
    
        jwt.verify(token, process.env.JWT_SECRET, async(err, data) => {
            if(err) {
                //return next(CreateError(500, "Reset link is expired"))
                res.send({"status":false, "message":"Reset link is expired!"});
            } else {
                const response = data;
                /*const user = await User.findOne({ email: { $regex: '^' + response.email + '$', $options: 'i'}})
                const salt = await bcrypt.genSalt(10)
                const encryptedPassword = await bcrypt.hash(newPassword, salt);
                user.password = encryptedPassword;*/
    
                try {
                    req.con.query(`UPDATE users SET userPassword = '${newPassword}', token = Null WHERE userEmail = '${response.email}'`, (error, results) => {  
                        if(results) {
                                res.send({"status":true, "message":"Password reset successfully!"});
                            }
                             
                         else if(error) {
                            console.log(error)
                        }
                    })
                    /*const updatedUser = await User.findOneAndUpdate(
                        {_id: user._id},
                        {$set: user},
                        {new: true}
                    )*/
                    //return next(CreateSuccess(200, "Password reset successfully"))
                } catch(error) {
                    res.send({"status":false, "message":"Something went wrong!"});
                    //return next(CreateError(500, "Something went wrong"))
    
                }
            }
        })
    })
    
module.exports = router