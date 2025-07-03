const userModel = require('../model/userModel')


// water quantiy logic-----------bugg!!
exports.addWaterIntakecontroller = async (req, res) => {

    console.log("In add water controller");

    try {
        const { date, waterTakenInMl } = req.body;
        if (!date || !waterTakenInMl) {
            res.status(401).json(createResponse(false, "Provide all Inputs", null))
        }

        const addDate = new Date(date)
        const user = await userModel.findById(req.userId)
        user.waterIntake.push({
            date: addDate,
            waterTakenInMl
        })
        await user.save()

        res.status(200).json(createResponse(true, "Water Intake added successfully", null))

    } catch (error) {
        res.status(500).json(createResponse(false, "something went wrong", error.message))

    }


}


exports.getWaterByDate = async (req, res) => {
    console.log("Inside get Water by Date controller");

    try {
        const { date } = req.body;
        if (!date) {
            res.status(404).json(createResponse(false, "Provide date", null))

        }


        const user = await userModel.findById(req.userId)
        const userWaterArr = user.waterIntake;
        if (userWaterArr.length == 0) {
            res.status(404).json(createResponse(false, "No Records Found", null))
        }

        const userWaterIntakes = filterByDate(userWaterArr, date)
        if (userWaterIntakes.length == 0) {
            res.status(404).json(createResponse(false, "No Records Found", null))
        }

        res.status(200).json(createResponse(true, userWaterIntakes, null))



    } catch (error) {
        res.status(500).json(createResponse(false, "something went wrong", error.message))

    }

}

exports.getWaterByLimit = async (req, res) => {
    console.log("inside get water by limit");

    try {

        const { limit } = req.body;
        if (!limit) {
            res.status(404).json(createResponse(false, "Provide ;imit", null))
        }

        const user = await userModel.findById(req.userId)
        const userWaterArr = user.waterIntake
        if (userWaterArr.length == 0) {
            res.status(404).json(createResponse(false, "No Records Found", null))
        }

        switch (limit) {
            case "all":
                res.status(200).json(createResponse(true, userWaterArr, null))
                break;
            case "last7days":
                const userWaterSevenDays = getLastDaysEntries(userWaterArr, 7)
                if (userWaterSevenDays.length == 0) {
                    res.status(404).json(createResponse(false, "No Records Found", null))
                }

                res.status(200).json(createResponse(true, userWaterSevenDays, null))

                break;
            case "last10days":
                const userWaterTenDays = getLastDaysEntries(userWaterArr, 10)
                if (userWaterTenDays.length == 0) {
                    res.status(404).json(createResponse(false, "No Records Found", null))
                }

                res.status(200).json(createResponse(true, userWaterTenDays, null))

                break;
            default:
                return res.status(404).json(createResponse(false, "limit not matched", null))
        }



    } catch (error) {
        res.status(500).json(createResponse(false, "something went wrong", error.message))

    }


}


exports.getGoalWaterIntake = async (req, res) => {
    console.log("Inside get goal water controller");
    try {
        const user = await userModel.findById(req.userId)

        let goalWaterIntake;
        if(user.gender=='male'){
            goalWaterIntake=3700
        }else{
            goalWaterIntake=2700
        }
        


        // To find total water in take in that day
        const userWaterArr = user.waterIntake;

        if (userWaterArr.length > 0) {
            let totalWaterOfDay = getTotalWater(userWaterArr)
            return res.status(200).json(createResponse(true, { totalWaterOfDay, goalWaterIntake }))

        } else {
            res.status(200).json(createResponse(true, { totalWaterOfDay: totalWaterOfDay = 0, goalWaterIntake }, null))
        }


    } catch (error) {
        res.status(500).json(createResponse(false, "something went wrong", error.message))

    }

}


function getTotalWater(entries) {

    // find the latest date
    const dates = entries.map(entry => new Date(entry.date).toDateString())
    const latestDate = dates.sort((a, b) => new Date(b) - new Date(a))[0];

    //  filter the entries with latest date
    const latestEntires = entries.filter((entry) => {
        return new Date(entry.date).toDateString() === latestDate;
    })

    //  calculate total water takenMl ( logic for total calculation )
    const totalwater = latestEntires.reduce((sum, entry) => sum + entry.waterTakenInMl, 0)

    return totalwater;

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