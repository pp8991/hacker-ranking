const mongoose=require('mongoose')


mongoose.connect('mongodb+srv://taskapp:physics123physics@cluster0.fnugi.mongodb.net/hacker-ranking?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})