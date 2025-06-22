const mongoose = require('mongoose')
const bcryt = require('bcrypt')

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
    dob: {
        type: Date,
        required: true
    },
    calorieIntake: [
        {
            item: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            quantityType: {
                type: String,
                required: true
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
            required: true
        },
        durationInHr:{
            type: String,
            required: true
        }
    },
    steps:[
        {
            steps:{
                type: Number,
                required: true
            },
            date: {
                type: Date,
                required: true
            }
        }
    ],
    workouts: [
        {
            exercise:{
                type:String,
                required: true
            },
            durationInMinutes:{
                type:Number,
                required: true
            },
            date:{
                type: Date,
                required: true
            }
        }
    ]

}, { timestamps: true })

const userModel = mongoose.model('users', userSchema)

module.exports = userModel

