import mongoose from 'mongoose'
const { Schema } = mongoose

const cartItemSchema = new Schema({
    _id: false,
    product: { 
        type: Schema.Types.ObjectId, 
        ref: 'Product',
        unique: true,
        required: true,
    },
    qty: {
        type: Number,
        default: 1,
        required: true, 
        unique: false,
    },
    // дата-время последнего изменения
    date: {
        type: Date,
        default: Date.now,
        required: true, 
        unique: false,
    }
})

const cartSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    items: [cartItemSchema],
}) 

export default mongoose.model('Cart', cartSchema)