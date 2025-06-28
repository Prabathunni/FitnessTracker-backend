const userModel = require('../model/userModel')


exports.addSleepController = async (req, res) => {
    console.log("Inside the add sleep controller..");

    try {
        const { date, durationInHr } = req.body;

        if (!date || !durationInHr) {
            res.status(404).json(createResponse(false, "provide date,sleep In Hr", null))
        }


        const user = await userModel.findById(req.userId)

        user.sleep.push({
            date: new Date(date),
            durationInHr: durationInHr
        })
        await user.save()

        res.status(200).json(createResponse(true,user.sleep,null))


    } catch (error) {
        res.status(500).json(createResponse(false, "something went wrong", error.message))
    }

}




exports.getSleepByDate = async (req, res) => {
    console.log("Inside the add sleep controller..");

}

exports.getSleepByLimit = async (req, res) => {
    console.log("Inside the add sleep controller..");

}
exports.getGoalSleep = async (req, res) => {
    console.log("Inside the add sleep controller..");

}


function createResponse(ok, response, error) {
    return ({
        ok,
        response,
        error
    })
}