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
    const already= await Score.findOne({'owner':req.user._id})
    if(already){
        return res.send("ScoreCard alread present")
    }
    try{
        score.ranking_coefficient = score.solution_accepted/score.solution_submited
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
    var mysort = { ranking_coefficient: -1 };
    try{
        const score=await Score.find().sort(mysort)
        res.send(score)
    }catch(e){
        res.status(400).send()
    }
})

//To Edit the Score Card
router.patch('/scores/update', auth,async (req,res) =>{
    const updates = Object.keys(req.body)
    const allowedUpdate =['challenge_solved','solution_submited','solution_accepted']
    const isValidOperation = updates.every((update) => allowedUpdate.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates!'})
    }
    
    try{
        const score = await Score.findOne({ owner: req.user._id})

        if(!score) {
            return res.status(404).send()
        }
        updates.forEach((update) => score[update] = req.body[update])
        await score.save()
        res.send(score)

    }catch(e){
        res.status(400).send()
    }
})

module.exports=router