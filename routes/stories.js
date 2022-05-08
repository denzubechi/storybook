const express = require("express");
const { mongoose } = require("mongoose");

const router = express.Router()
const { ensureAuth,} = require('../middleware/auth')

const Story = require('../models/Story')
const Users = require('../models/Users')

//@desc login/Landing page
//Get / 
router.get('/add', ensureAuth,(req,res)=>{
    res.render('stories/add')
})

//@desc post the add form
//@route Post stories
router.post('/', ensureAuth, async(req,res)=>{
    try{
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
    }catch(err){
        console.error(err)
        res.render('errors/500')
    }
})

//@desc show all public stories
//@route GET/stories/add
router.get('/stories', ensureAuth, async (req,res)=>{
    try{
        const stories = await Story.find({ status: 'public'})
        .populate('user')
        .sort({ createdAt: 'desc'})
        .lean() //to pass to handlebars

        res.render('stories/index', { stories })
    }catch(err){
     
        console.error(err)
        res.render('errors/500')
    }
})

//desc stories/:id
//@route GET /stories/:id
router.get('/:id', ensureAuth, async (req,res)=>{
    try{
        let story =  await Story.findById(req.params.id)
        .populate('user')
        .lean()
        if(!story){
            res.render('errors/404')
        }else{
            res.render('stories/show', { story})
        }
    }catch(err){
        console.error(err)
        res.render('errors/500')
    }
})
   
    //@desc stories/edit
//Get /stories/edit/:id
router.get('/edit/:id', ensureAuth, async (req,res)=>{
   try{
    const story = await Story.findOne({
        _id: req.params.id,
    }).lean()
 
     if(!story){
         res.render('errors/404')
    }
    if (story.user != req.user.id){
        res.redirect('/stories')
    }else{
        res.render('stories/edit', { 
            story,
          })
    }
   }catch(err){
       console.error(err)
       res.render('errors/500')
   }
})
//Update story
//@route PUT /stories/add
router.put('/:id', ensureAuth, async (req,res) => {
   try{
    let story = await Story.findById(req.params.id).lean()

    if(!story){
        return res.render('errors/404')
    }
    if (story.user != req.user.id){
        res.redirect('/stories')
    } else{
        story = await Story.findOneAndUpdate({ _id: req.params.id}, req.body, {
            new: true,
            runValidators: true,
        })
        res.redirect('/dashboard')
    }
   }catch(err){
    console.error(err)
    res.render('errors/500')
   }
})
router.delete('/:id', ensureAuth, async (req,res) => {
    try{
        await Story.remove({ _id: req.params.id})
        res.redirect('/dashboard')
    }catch(err){
        console.error(err);
        res.render('errors/500')
    }
})
router.get('/user/:userId', ensureAuth, async (req,res) => {
    try{
        const stories = await Story.find({
            user: req.params.userId,
            status: 'public'
        })
        .populate('user')
        .lean()

        res.render('stories/index', { stories})
    }catch(err){
        console.error(err)
        res.render('errors/500')
    }

})


module.exports = router