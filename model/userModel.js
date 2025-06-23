const mongoose = require('mongoose')

const userSchema =new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    weight: [
        {
            weight: {
                type: Number,
                required: true
            },
            date: {
                type: Date,
                required: true
            }
        }
    ],
    height: [
        {
            height: {
                type: Number,
                required: true
            },
            date: {
                type: Date,
                required: true
            }
        }
    ],
    goal: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    calorieIntake: [
        {
            item: {
                type: String,
            },
            date: {
                type: Date,
            },
            quantity: {
                type: Number,
            },
            quantityType: {
                type: String,
            },
        }
    ],
    activityLevel: {
        type: String,
        required: true
    },
    sleep: {
        sleep: {
            type: Date,
        },
        durationInHr:{
            type: String,
        }
    },
    steps:[
        {
            steps:{
                type: Number,
            },
            date: {
                type: Date,
            }
        }
    ],
    workouts: [
        {
            exercise:{
                type:String,
            },
            durationInMinutes:{
                type:Number,
            },
            date:{
                type: Date,
            }
        }
    ]

}, { timestamps: true })

const userModel = mongoose.model('users', userSchema)

module.exports = userModel

