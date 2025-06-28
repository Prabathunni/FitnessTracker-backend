const userModel = require('../model/userModel')



exports.addWeightController = async (req, res) => {

    console.log("In add weight controller");

    try {
        const { date, weight } = req.body;
        if (!date || !weight) {
            res.status(401).json(createResponse(false, "Provide all Inputs", null))
        }

        const addDate = new Date(date)
        const user = await userModel.findById(req.userId)
        user.weight.push({
            date: addDate,
            weight
        })

        await user.save()

        res.status(200).json(createResponse(true, user, null))

    } catch (error) {
        res.status(500).json(createResponse(false, "something went wrong", error.message))

    }


}


exports.getWeightbyDate = async (req, res) => {
    console.log("inside get weight by date controller");

    try {
        const { date } = req.body;
        if (!date) {
            res.status(404).json(createResponse(false, "provide date", null))
        }

        const user = await userModel.findById(req.userId)
        const userWeightArr = filterByDate(user.weight, date)

        if (userWeightArr == 0) {
            res.status(404).json(createResponse(false, "No Record found on the day", null))
        }


        res.status(200).json(createResponse(true, userWeightArr, null))



    } catch (error) {
        res.status(500).json(createResponse(false, "something went wrong", error.message))

    }

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
