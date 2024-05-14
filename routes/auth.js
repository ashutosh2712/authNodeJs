const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var dotenv = require('dotenv')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
dotenv.config()
// Define route to render registration page
router.get('/register', (req, res) => {
    res.render('register');
});

//registration
router.post('/register', async(req,res) => {
    try{
        const {email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password,10);
        const user = new User({email, password:hashedPassword});
        await user.save();
        res.redirect('/home');


    }catch(error) {
        res.status(500).json({error: 'Registration failed'})
    }
    
})

router.get('/login', (req, res) => {
    res.render('login');
});


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
        const token = jwt.sign({userId:user._id}, `${process.env.SESSION_SECRET}`,{
            expiresIn: '100h',
        });
        // Store token in session
        req.session.token = token;
        console.log(req.session.token);
        res.status(200).redirect('/home');
    }catch(error) {
        res.status(500).json({error: 'Login Failed'})
    }
});


//logout
router.post('/logout',(req,res) =>{
    try{
        req.session.destroy((err) =>{
            if(err) {
                console.error('Error destroying session:', err);
                res.status(500).json({error: 'Logout failed'});
            }else{
                res.status(200).redirect('/auth/login');
            }
        });
    } catch(error) {
        console.error('Logout error:', error);
        res.status(500).json({error: 'Logout failed'});
    }
})

//Authentication using Google Account
router.get('/google',passport.authenticate('google', { scope: ['profile', 'email'] }),
function(req, res) {
  // Successful authentication, redirect home.
  res.redirect('/home');
})

router.get('/google/callback', passport.authenticate('google',{
    failureRedirect: '/auth/register',
    successRedirect:'/home'
}))

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // Retrieve user information from the Google profile
    const { id, displayName, emails } = profile;
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
    User.findOne({ googleId: id })
    .then(existingUser => {
        if (existingUser) {
            return done(null, existingUser);
        } else {
            const newUser = new User({
                googleId: id,
                googleDisplayName: displayName,
                googleEmail: emails[0].value
            });

            newUser.save()
                .then(savedUser => {
                    return done(null, savedUser);
                })
                .catch(err => {
                    return done(err);
                });
        }
    })
    .catch(err => {
        return done(err);
    });
}));

passport.serializeUser((user, done) =>{
    done(null,user.id)
})

passport.deserializeUser((id,done) =>{
    User.findById(id,(err,user) =>{
        done(err,user);
    });
});

module.exports = router;