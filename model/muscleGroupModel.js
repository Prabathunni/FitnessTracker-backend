const mongoose = require('mongoose')

const muscleSchema = new mongoose.Schema({
    type:{
        type:String,
        required: true
    },
    imageUrl:{
        type:String,
        required: true
    }
})

const muscleGroupModel = mongoose.model('muscle-groups', muscleSchema)

module.exports = muscleGroupModel