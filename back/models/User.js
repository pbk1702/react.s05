import mongoose from 'mongoose'
const { Schema } = mongoose

const userSchema = new Schema({
    login: { 
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        unique: false,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
})

export default mongoose.model('User', userSchema)