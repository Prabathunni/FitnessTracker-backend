const { response } = require('express');
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

        res.status(200).json(createResponse(true, "Updated Successfully", null))


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

        if (userSleepByDate == 0) {
            res.status(404).json(createResponse(false, "No Record found on the day", null))
        }


        res.status(200).json(createResponse(true, userSleepByDate, null))


    } catch (error) {
        res.status(500).json(createResponse(false, "something went wrong", error.message))

    }

}

exports.getSleepByLimit = async (req, res) => {
    console.log("Inside the add sleep controller..");

    try {
        const { limit } = req.body;
        if (!limit) {
            res.status(404).json(createResponse(false, "provide limit", null))
        }

        const user = await userModel.findById(req.userId)

        switch (limit) {
            case "all":
                if (user.sleep.length == 0) {
                    res.status(404).json(createResponse(false, "No sleep Records found", null))
                }

                res.status(200).json(user.sleep)
                break;
            case 'last7days':
                const userSleepArr = user.sleep;
                if (userSleepArr.length == 0) {
                    res.status(404).json(createResponse(false, "No sleep Records found", null))
                }

                const userSleepByLimit = getLastDaysEntries(userSleepArr, 7)
                if (userSleepByLimit.length == 0) {
                    res.status(404).json(createResponse(false, "No Records found", null))
                }


                res.status(200).json(createResponse(true, userSleepByLimit, null))

                break;
            case 'last10days':
                const userSleepArrFor10 = user.sleep;
                if (userSleepArrFor10.length == 0) {
                    res.status(404).json(createResponse(false, "No sleep Records found", null))
                }

                const userSleepByTenLimit = getLastDaysEntries(userSleepArrFor10, 10)
                if (userSleepByTenLimit.length == 0) {
                    res.status(404).json(createResponse(false, "No Records found", null))
                }
                res.status(200).json(createResponse(true, userSleepByTenLimit, null))

                break;
            default:
                return res.status(403).json(createResponse(false, "limit not matched", null))

        }



    } catch (error) {
        res.status(500).json(createResponse(false, "something went wrong", error.message))

    }

}


exports.getGoalSleep = async (req, res) => {
    console.log("Inside the add sleep controller..");
    try {

        let targetSleepInHrs = 8;

        // to find the total slept hrs 
        const user = await userModel.findById(req.userId)
        const userSleepArr = user.sleep;

        if (userSleepArr.length > 0) {
            let totalSleepForTheDay = getTotalSleep(userSleepArr)
            return res.status(200).json(createResponse(true, { totalSleepForTheDay, targetSleepInHrs }))

        } else {
            return res.status(200).json(createResponse(true, { totalSleepForTheDay: totalSleepForTheDay = 0, targetSleepInHrs }))
        }



    } catch (error) {
        res.status(500).json(createResponse(false, "something went wrong", error.message))

    }

}


function getTotalSleep(entries) {

    // find the latest date
    const dates = entries.map(entry => new Date(entry.date).toDateString())
    const latestDate = dates.sort((a, b) => new Date(b) - new Date(a))[0];

    //  filter the entries with latest date
    const latestEntires = entries.filter((entry) => {
        return new Date(entry.date).toDateString() === latestDate;
    })

    //  calculate total sleep durationInHr ( logic for total calculation )

    const totalSleep = latestEntires.reduce((sum, entry) => sum + entry.durationInHr, 0)

    return totalSleep;

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