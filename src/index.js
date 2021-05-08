const express=require('express')
require('./db/mongoose')
const User=require('./models/user')
const userRouter = require('./routers/user')
const scoreRouter = require('./routers/score')

const app=express()
const port=process.env.PORT | 3000

app.use(express.json())
app.use(userRouter)
app.use(scoreRouter)

app.listen(port, () => {
    console.log('Server is Up on port! '+ port)
})