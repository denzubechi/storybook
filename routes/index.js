const express = require("express");
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const Users = require('../models/Users')
const Story = require('../models/Story')
//@desc login/Landing page
//Get / 
router.get('/', ensureGuest,(req,res)=>{
    res.render('login',{layout: 'login'})
})
//@desc dashboard
//Get / dashboard
router.get('/dashboard', ensureAuth, async (req,res)=>{
    try{
        //limiting the stories to logged in users
        const stories = await Story.find({ user: req.user.id}).lean()// passing in doc in the template
        res.render('dashboard', {
            name: req.user.firstName,
            _id: req.user._id,
            stories
        })
    }catch(err){
        console.error(err);
        res.render('errors/500')
    }
})


            


module.exports = router