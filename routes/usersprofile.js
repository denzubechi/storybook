const express = require("express");
const { mongoose } = require("mongoose");

const router = express.Router()
const { ensureAuth,} = require('../middleware/auth')

const Story = require('../models/Story')
const Users = require('../models/Users')

//@desc login/Landing page
//Get / 
//router.get('/profile/:id', ensureAuth, async (req,res)=>{
  //  let user = await Users.findById(req.params.id).lean()
   // if (!user){
  //      res.render('errors/404')
   // }else{
     //   res.render('profile',{
      //      name: req.user.firstName,

   //     })
//}
//})
module.exports = router