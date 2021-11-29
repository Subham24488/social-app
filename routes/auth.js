const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/keys');
const User = mongoose.model("User");
const requireLogin = require('../middleware/requireLogin')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

//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

const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
         api_key:"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"
    }
}))

router.get("/protected", requireLogin, (req, res) => {
    res.send("hello user")
})

router.post("/signup", (req, res) => {
    const {name, email, password, pic} = req.body;
    if(!name || !email || !password){
       return res.status(422).json({error:"enter all fields"})
    }else {
        User.findOne({email:email})
        .then((savedUser) => {
            if(savedUser){
                return res.status(422).json({error:"user Exists"})
            }
            bcrypt.hash(password, 12)
            .then(hashedPassword => {
                const user = new User({
                    name,
                    email,
                    password:hashedPassword,
                    pic
                })
                user.save()
                .then(user => {
                    transporter.sendMail({
                        to:user.email,
                        from:"no-reply@insta.com",
                        subject:"signup success",
                        html:"<h1>Welcome to social age</h1>"
                    })
                   res.json({message:"saved successfully"})
                })
                .catch(err => {
                    console.log(err)
                })
            })
        })
        .catch(err => {
            console.log(err)
        })
    }
});

router.post("/signin", (req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(422).json({error:"enter all fields"})
    }
    User.findOne({email:email})
    .then((savedUser) => {
        if(!savedUser){
            return res.status(422).json({error:"email or password is invalid"})
        }
        bcrypt.compare(password, savedUser.password)
        .then(doMatch => {
            if(doMatch){
                // res.json({message:"sucessfully signed in"})
                const token = jwt.sign({_id:savedUser._id}, JWT_SECRET)
                const {_id,name, email, followers, following, pic} = savedUser
                res.json({token, user:{_id,name, email, followers, following, pic}})
                          
            }else{
                res.status(422).json({error:"email or password is invalid"})
            }
        })
        .catch(err => {
            console.log(err)
        })
    })
})

module.exports = router;