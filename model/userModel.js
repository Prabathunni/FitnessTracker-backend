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
           type:mongoose.Schema.Types.ObjectId,
           ref: 'calories'
        }
    ],
    activityLevel: {
        type: String,
        required: true
    },
    sleep: [
        {
            date: {
            type: Date,
        },
        durationInHr:{
            type: Number,
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

