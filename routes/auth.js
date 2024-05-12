const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

//registration
router.post('/register', async(req,res) => {
    try{
        const {email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password,10);
        const user = new User({email, password:hashedPassword});
        await user.save();
        res.status(201).json({message: 'User registered successfully '});
    }catch(error) {
        res.status(500).json({error: 'Registration failed'})
    }
    
})


//login
router.post('/login', async(req,res) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user) {
            return res.status(401).json({error: 'User not found.'});
        }
        const passwordMatch = await bcrypt.compare(password,user.password);
        if(!passwordMatch) {
            return res.status(401).json({error: 'Wrong Password!'});
        }
        const token = jwt.sign({userId:user._id}, 'your-secret-key',{
            expiresIn: '100h',
        });
        res.status(200).json({token});
    }catch(error) {
        res.status(500).json({error: 'Login Failed'})
    }
})


module.exports = router;