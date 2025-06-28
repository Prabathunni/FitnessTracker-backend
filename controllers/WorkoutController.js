const userModel = require('../model/userModel')



exports.addWorkoutController = async (req, res) => {

    console.log("Inside add workout controller");

    try {

    } catch (error) {
        res.status(500).json(createResponse(false, "something went wrong", error.message))

    }



}

exports.getWorkoutByDate = async (req, res) => {

}
exports.getWorkoutBylimit = async (req, res) => {

}
exports.getGoalWokrout = async (req, res) => {

}