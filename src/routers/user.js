const express=require('express')
const User=require('../models/user')
const router=new express.Router()
const auth=require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')

//For User SignUp
router.post('/users', async (req,res) => {
    const user=new User(req.body)
    try{
        await user.save()
        const token= await user.generateAuthToken()
        res.status(201).send({ user, token})
    }catch(e){
        res.status(400).send(e)
    }
})

//For User Login
router.post('/users/login', async (req,res) =>{
    try{
        const user =await User.findByCredentials(req.body.email, req.body.password)
        const token= await user.generateAuthToken()
        res.send({user, token})
    }catch(e){
        res.status(400).send()
    }
})

//For User Logout
router.post('/users/logout', auth, async (req, res) =>{
    try{
        req.user.tokens = req.user.tokens.filter((token) =>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    }catch(e) {
        res.status(500).send()
    }
})

//For logging Out From All devices
router.post('/users/logoutAll', auth, async(req, res) =>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(e) {
        res.status(500).send()
    }
})

//To get own details
router.get('/users/me', auth, async (req, res) =>{
    res.send(req.user)
 })


 //To Upload User Image
 const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|png|jpeg)$/)){
            return cb(new Error('Please Upload an Image'))
        }
        cb(undefined, true)
    }
})

//Upload an avatar
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) =>{
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) =>{
    res.status(400).send({ error: error.message})
})

//To delete a profile Picture
router.delete('/users/me/avatar', auth, async (req, res) =>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

//To get the peofile picture
router.get('/users/:id/avatar', async (req, res) =>{
    try{
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)

    } catch(e) {
        res.status(404).send()
    }
})

 module.exports=router