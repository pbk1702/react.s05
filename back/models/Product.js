import mongoose from 'mongoose'
const { Schema } = mongoose

const productSchema = new Schema({     
    title: { 
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    img: {
        type: String,                        
    },
})

export default mongoose.model('Product', productSchema)