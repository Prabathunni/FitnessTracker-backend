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

        res.status(200).json(createResponse(true, user.sleep, null))


    } catch (error) {
        res.status(500).json(createResponse(false, "something went wrong", error.message))
    }

}


exports.getSleepByDate = async (req, res) => {
    console.log("Inside the add sleep controller..");

    try {
        const { date } = req.body;
        if (!date) {
            res.status(404).json(createResponse(false, "provide date", null))
        }

        const user = await userModel.findById(req.userId)
        const userSleepByDate = filterByDate(user.sleep, date)

        if (userSleepByDate==0) {
            res.status(404).json(createResponse(false, "No Record found on the day", null))
        }


        res.status(200).json(createResponse(true,userSleepByDate,null))


    } catch (error) {
        res.status(500).json(createResponse(false, "something went wrong", error.message))

    }

}

exports.getSleepByLimit = async (req, res) => {
    console.log("Inside the add sleep controller..");

}
exports.getGoalSleep = async (req, res) => {
    console.log("Inside the add sleep controller..");

}




function filterByDate(entries, neededDate) {
    return (
        entries.filter((entry) => {
            const targetDate = new Date(neededDate)
            const entryDate = new Date(entry.date);
            return (
                entryDate.getFullYear() == targetDate.getFullYear() &&
                entryDate.getMonth() == targetDate.getMonth() &&
                entryDate.getDate() == targetDate.getDate()
            )
        })
    )
}

function createResponse(ok, response, error) {
    return ({
        ok,
        response,
        error
    })
}