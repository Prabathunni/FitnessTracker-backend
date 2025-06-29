const mongoose = require('mongoose')

const workoutSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        unique: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    durationInMinutes: {
        type: Number,
        required: true
    },
    exercises: [
        {
            exercise: {
                type: String,
                required: true,
            },
            videoUrl: {
                type: String,
                required: true
            },
            sets: {
                type: Number,
                required: true
            },
            reps: {
                type: Number,
                required: true
            },
            rest: {
                type: Number,
                required: true
            },
            description: {
                type: String,
                required: true
            },
        }
    ]
})

const workoutModel = mongoose.model('workouts', workoutSchema)
module.exports = workoutModel;