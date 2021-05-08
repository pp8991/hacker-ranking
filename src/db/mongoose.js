const mongoose=require('mongoose')


mongoose.connect('mongodb://127.0.0.1:27017/hacker-ranking-system',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})