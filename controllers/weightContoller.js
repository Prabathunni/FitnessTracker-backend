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

exports.getWeightByLimit = async (req, res) => {
    console.log("Inside Set weight by limit controller...");

    try {
        const { limit } = req.body;
        if (!limit) {
            res.status(404).json(createResponse(false, "provide limit", null))
        }

        const user = await userModel.findById(req.userId)

        switch (limit) {
            case "all":
                if (user.weight.length == 0) {
                    res.status(404).json(createResponse(false, "No weight Records found", null))
                }

                res.status(200).json(createResponse(true, user.weight, null))

                break;
            case "last7days":
                const userWeightArr = user.weight;
                if (userWeightArr.length == 0) {
                    res.status(404).json(createResponse(false, "No sleep Records found", null))
                }

                const userWeightByLimit = getLastDaysEntries(userWeightArr, 7)
                if (userWeightByLimit.length == 0) {
                    res.status(404).json(createResponse(false, "No Records found", null))
                }


                res.status(200).json(createResponse(true, userWeightByLimit, null))

                break;
            case "last10days":
                const userWeightArrFor10 = user.weight;
                if (userWeightArrFor10.length == 0) {
                    res.status(404).json(createResponse(false, "No weight Records found", null))
                }

                const userWeightbyTenLimit = getLastDaysEntries(userWeightArrFor10, 10)
                if (userWeightbyTenLimit.length == 0) {
                    res.status(404).json(createResponse(false, "No Records found", null))
                }
                res.status(200).json(createResponse(true, userWeightbyTenLimit, null))

                break;
            default:
                return res.status(403).json(createResponse(false, "limit not matched", null))

        }



    } catch (error) {
        res.status(500).json(createResponse(false, "something went wrong", error.message))

    }


}


exports.getGoalWeigtht = async (req, res) => {
    console.log("Inside get goal weight controller");

    try {

        const { goalWeight } = req.body;
        if (!goalWeight) {
            res.status(404).json(createResponse(false, "Provide Goal Weight!", null))
        }

        // to find latest weight
        const user = await userModel.findById(req.userId)
        const userWeightArr = user.weight;
        if (userWeightArr == 0) {
            res.status(404).json(createResponse(false, "No Record found", null))
        }

        const latestuserArr = userWeightArr.sort((a, b) => b.date - a.date)[0]
        const latestWeight = latestuserArr.weight;

        res.status(200).json(createResponse(true, {latestWeight, goalWeight}, null))



    } catch (error) {
        res.status(500).json(createResponse(false, "something went wrong", error.message))

    }


}



function getLastDaysEntries(entries, numberOfDays) {
    const now = new Date();
    const startDay = new Date();
    startDay.setDate(now.getDate() - numberOfDays)

    return (entries.filter((entry) => {
        const entryDate = new Date(entry.date);
        return (
            entryDate >= startDay && entryDate <= now
        )
    })
    )
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
