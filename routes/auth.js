const express = require("express");
const router = express.Router()
const passport = require("passport")

//@desc login/google oauth
//Get / 
router.get(
    '/google',
    passport.authenticate('google',{ scope: ['profile']}))

//@desc google auth callback
//Get / /auth/google/callback
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/'}),
    (req,res)=>{
        res.redirect('/dashboard')
    })
//@desc logout
router.get('/logout',(req,res) => {req.logout()
        res.redirect('/')
    })



module.exports = router