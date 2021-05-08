const express=require('express')
const auth = require('../middleware/auth')
const { update } = require('../models/score')
const Score=require('../models/score')
const router=new express.Router()

//Creating the Score of hacker(it may be created by its
// contest but here we are creating manually to get the data)
router.post('/scores', auth, async (req,res) => {
    const score = new Score({
        ...req.body,
        owner: req.user._id
    })
    try{
        await score.save()
        res.status(201).send(score)
    }catch(e) {
        res.status(400).send(e)
    }
})

//Get own Score Profile
router.get('/scores/me', auth, async (req, res) =>{
    
    try{
        const score = await Score.findOne({ owner: req.user._id})
        if(!score) {
            res.status(404).send()
        }
        res.send(score)
    }catch(e) {
        res.status(500).send()
    }
})

//Get all Score Profile
router.get('/scores', auth, async (req, res) =>{
    var mysort = { solution_accepted: -1 };
    try{
        const score=await Score.find().sort(mysort)
        res.send(score)
    }catch(e){
        res.status(400).send()
    }
})

module.exports=router