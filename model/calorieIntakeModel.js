const mongoose = require('mongoose')

const calorieSchema = new mongoose.Schema({
    item:{
        type:String,
        required: true
    },
    quantity:{
        type:Number,
        required:true
    },
    unit:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default: Date.now,
        required:true
    },
    
    // Reference to user
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required:true
    }
})

const calorieIntakeModel =  mongoose.model('calories', calorieSchema)
module.exports = calorieIntakeModel