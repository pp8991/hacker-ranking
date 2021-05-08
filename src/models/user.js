const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require:true,
        trim:true,
    },
    email: {
        type:String,
        unique: true,
        require: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('Email is in valid')
            }
        }
    },
    location: {
        type: String,
    },
    password: {
        type:String,
        require: true,
        trim: true,
        minlength:7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password can not contain "password"')
            }
        },
    },
    tokens: [{
        token: {
            type: String,
            require: true,
        }
    }],
    avatar: {
        type: Buffer
    },
}, {
    timestamps: true
})

userSchema.virtual('userscore', {
    ref: 'Score',
    localField: '_id',
    foreignField: 'owner'
})

//to hide unnecessary information given to user
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    
    delete userObject.password
    delete userObject.tokens
    return userObject
}

//Generating Authentication token using jwt
userSchema.methods.generateAuthToken = async function () {
    const user= this
    const token = jwt.sign({_id: user._id.toString() }, 'thisIsSecret')

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async (email, password) =>{
    const user = await User.findOne({email})

    if(!user){
        throw new Error('Unable to Login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error('Unable to login')
    }

    return user
}

//hash the plain text password before saving
userSchema.pre('save',async function (next){
    const user = this

    if(user.isModified('password')){
        user.password= await bcrypt.hash(user.password, 8)
    }

    next()
})

const User=mongoose.model('User',userSchema)

module.exports = User