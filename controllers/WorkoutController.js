const { set } = require('mongoose');
const workoutModel = require('../model/workoutModel')



exports.addMuscleGroupController = async (req, res) => {

    console.log("Inside add workout controller");

    try {

        const { type, imageUrl, durationInMinutes } = req.body;

        if (!type || !imageUrl || !durationInMinutes) {
            res.json(createResponse(false, "Provide All Inputs", null))
        }

        const workout = new workoutModel({
            type,
            imageUrl,
            durationInMinutes,
        })
        await workout.save()

        res.json(createResponse(true, workout, null))



    } catch (error) {
        res.status(500).json(createResponse(false, "something went wrong", error.message))

    }

}

exports.addExercise = async (req, res) => {

    console.log("inside add exercise controller");

    try {

        const workouts = await workoutModel.findById(req.params.id)
        const { exercise, videoUrl, sets, reps, rest, description } = req.body;

        if (!exercise || !videoUrl || !sets || !reps || !rest || !description) {
            res.status(404).json(createResponse(false, "Provide All Inputs", null))
        }

        workouts.exercises.push({
            exercise,
            videoUrl,
            sets,
            reps,
            rest,
            description
        })

        await workouts.save()

        res.status(201).json(createResponse(true, workouts, null))


    } catch (error) {
        res.status(500).json(createResponse(false, "something went wrong", error.message))

    }


}


exports.getWorkoutById = async (req, res) => {

    console.log("Inside get workout by id controller");

    try {

        const workout = await workoutModel.findById(req.params.id)
        if (!workout) {
            res.status(404).json(createResponse(false, "provide workoutid", null))
        }

        res.status(200).json(createResponse(true, workout, null))

    } catch (error) {
        res.status(500).json(createResponse(false, "something went wrong", error.message))

    }


}


exports.getAllWorkouts = async (req, res) => {
    console.log("Inside get all workout controller");

    try {
        const workouts = await workoutModel.find()
        if (workouts.length == 0) {
            res.status(404).json(createResponse(false, "NO WORKOUTS ...", null))
        }

        res.status(200).json(createResponse(true, workouts, null))


    } catch (error) {
        res.status(500).json(createResponse(false, "something went wrong", error.message))

    }


}

exports.getAllExerciseById = async (req, res) => {
    console.log("Inside get all exercises by Id controller");

    try {

        const workout = await workoutModel.findById(req.params.id);
        const exercises = workout.exercises;
        if (exercises.length == 0) {
            res.status(404).json(createResponse(false, "NO exercises..", null))
        }

        res.status(200).json(createResponse(true, exercises, null))

    } catch (error) {
        res.status(500).json(createResponse(false, "something went wrong", error.message))
    }

}


exports.DeleteExercisebyId = async (req, res) => {
    console.log("Inside Delete exercise by id controller");

    try {
        const { workoutId, exerciseId } = req.params;

        const result = await workoutModel.updateOne(
            { _id: workoutId },
            { $pull: { exercises: { _id: exerciseId } } }
        )

        if (result.modifiedCount === 0) {
            res.status(404).json(createResponse(false, "exercise not found", null))
        }
        res.status(200).json(createResponse(true, "Exercise Deleted Successfully", null))
        res

    } catch (error) {
        res.status(500).json(createResponse(false, "something went wrong", error.message))
    }

}

exports.UpdateAExerciseById = async (req, res) => {

    console.log("Inside update by exercise by controller..");
    try {
        const { workoutId, exerciseId } = req.params;
        const updatedData = req.body;

        const result = await workoutModel.updateOne(
            { _id: workoutId, "exercises._id": exerciseId },
            {
                $set: {
                    "exercises.$.exercise": updatedData.exercise,
                    "exercises.$.videoUrl": updatedData.videoUrl,
                    "exercises.$.sets": updatedData.sets,
                    "exercises.$.reps": updatedData.reps,
                    "exercises.$.rest": updatedData.rest,
                    "exercises.$.description": updatedData.description
                }
            }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Exercise not found or no changes made" });
        }

        res.status(200).json({ message: "Exercise updated successfully" });


    } catch (error) {
        res.status(500).json(createResponse(false, "something went wrong", error.message))
    }


}


function createResponse(ok, response, error) {
    return ({
        ok,
        response,
        error
    })
}