const mongoose=require('mongoose')
const validator=require('validator')

const scoreShema = new mongoose.Schema({
    challenge_solved: {
        type: Number,
    },
    solution_submited: {
        type: Number,
    },
    solution_accepted:{
        type: Number,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    }
},{
    timestamps:true
})

const Score=mongoose.model('Score',scoreShema)


module.exports = Score