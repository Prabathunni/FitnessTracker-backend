const userModel = require('../model/userModel')



exports.addWorkoutController = async (req, res) => {

    console.log("Inside add workout controller");

    try {

        const { exercise, durationInMinutes, date } = req.body;
        if (!exercise || !durationInMinutes || !date) {
            res.status(404).json(createResponse(false, "Please provide an Inputs", null))
        }

        const user = await userModel.findById(req.userId)
        user.workouts.push({
            exercise,
            durationInMinutes,
            date
        })

        res.status(200).json(createResponse(false, user, null))



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



function createResponse(ok, response, error) {
    return ({
        ok,
        response,
        error
    })
}