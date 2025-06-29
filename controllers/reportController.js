const userModel = require('../model/userModel')
const calorieIntakeModel = require('../model/calorieIntakeModel')


function createResponse(ok, response, error) {
    return ({
        ok,
        response,
        error
    })
}

// --------------------sleep functions

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

// ----------------------water function
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


const reportController = async (req, res) => {
    console.log("Inside Report Controller...");

    try {

        const user = await userModel.findById(req.userId)

        // ___________________________________________________GOAL AND DAILY CALORIE INTAKE
        const activityFactors = {
            sedentary: 1.2,
            light: 1.375,
            moderate: 1.55,
            active: 1.725,
            very_active: 1.9
        };
        const weightSortArr = user.weight.sort((a, b) => new Date(b.date) - new Date(a.date))[0]  // descending ordering the array to get latest weight on basis of date
        const heightSortArr = user.height.sort((a, b) => new Date(b.date) - new Date(a.date))[0]  // descending ordering the array to get latest weight on basis of date
        const weight = weightSortArr.weight;
        const height = heightSortArr.height;
        const gender = user.gender;
        const goal = user.goal;
        const age = user.age;
        const activity = user.activityLevel;

        const activityMultiplier = activityFactors[activity];

        if (!activityMultiplier) {
            return res.status(400).json(createResponse(false, "Invalid activity level", null));
        }
        if (weightSortArr.length == 0 || heightSortArr.length == 0 || goal == "" || gender == "") {
            res.status(404).json(createResponse(false, "Please provide the weight/height/goal/gender", null))
        }


        let BMR = 0;

        if (gender == "male") {
            BMR = (10 * weight) + (6.25 * height) - (5 * age) + 5;

        } else if (gender == "female") {
            BMR = (10 * weight) + (6.25 * height) - (5 * age) - 161;

        } else if (gender == "other") {
            BMR = (10 * weight) + (6.25 * height) - (5 * age) - 161;

        } else {
            return res.status(404).json(createResponse(false, "gender cannot be found..", null))
        }

        let goalCalorieTarget = BMR * activityMultiplier;

        if (goal === "weightGain") {
            goalCalorieTarget += 500;
        } else if (goal === "weightLoss") {
            goalCalorieTarget -= 500;
        } else if (goal === "maintainWeight") {
            goalCalorieTarget = BMR;
        } else {
            res.status(404).json(createResponse(false, "provide Goal", null))
        }



        const userCalories = await calorieIntakeModel.find({
            user: req.userId
        })

        let valueForCaloriePerDay = 0;


        if (userCalories.length > 0) {

            // ----------------------------------------- get total calories of that Latest day

            // Step 1: Find the latest date
            const latestEntry = userCalories.reduce((latest, current) =>
                new Date(current.date) > new Date(latest.date) ? current : latest
            );
            console.log(latestEntry);
            

            const latestDate = new Date(latestEntry.date);

            // Step 2: Filter all entries with the same date (ignoring time)
            const latestDateOnly = new Date(
                latestDate.getFullYear(),
                latestDate.getMonth(),
                latestDate.getDate()
            );

            console.log(latestDateOnly);
            

            const entriesOnLatestDate = userCalories.filter(entry => {
                const entryDate = new Date(entry.date);
                return (
                    entryDate.getFullYear() === latestDateOnly.getFullYear() &&
                    entryDate.getMonth() === latestDateOnly.getMonth() &&
                    entryDate.getDate() === latestDateOnly.getDate()
                );
            });

            // Step 3: Sum the calories
            const totalCaloriesOnTheDay = entriesOnLatestDate.reduce((sum, entry) => sum + entry.calorieInTake, 0);

            valueForCaloriePerDay = Math.round(totalCaloriesOnTheDay)

        }

        // _______________________________________________________________Sleep Total and goal

        let targetSleepInHrs = 8;

        // to find the total slept hrs 
        const userSleepArr = user.sleep;
        let totalSleepForTheDay = 0;

        if (userSleepArr.length > 0) {
            totalSleepForTheDay = getTotalSleep(userSleepArr)
        }


        // _______________________________________________________________Water goal and total

        let goalWaterIntake;
        let totalWaterOfDay = 0;

        if (gender == "male") {
            goalWaterIntake = 3700
        } else {
            goalWaterIntake = 2700
        }

        // To find total water in take in that day
        const userWaterArr = user.waterIntake;

        if (userWaterArr.length > 0) {
            totalWaterOfDay = getTotalWater(userWaterArr)
        }


        // ________________________________________________________________________weight total and goal
        let weeks = 4;
        const calorieDiffPerDay = goalCalorieTarget - (BMR * activityMultiplier);
        const calorieDiffPerWeek = calorieDiffPerDay * 7;
        const weightChangePerWeek = calorieDiffPerWeek / 7700; // 1kg ≈ 7700 kcal
        const projectedWeight = Math.round((weight + (weightChangePerWeek * weeks)) * 10) / 10;




        const Report = [
            {
                name: "CALORIE INTAKE",
                value: valueForCaloriePerDay ? valueForCaloriePerDay : 0,
                unit: "CAL",
                goal: Math.round(goalCalorieTarget),
                goalUnit: "CAL"
            },
            {
                name: "SLEEP",
                value: totalSleepForTheDay ?? 0,
                unit: "Hrs",
                goal: targetSleepInHrs,
                goalUnit: "Hrs"
            },
            {
                name: "WATER INTAKE",
                value: totalWaterOfDay ?? 0,
                unit: "ML",
                goal: goalWaterIntake,
                goalUnit: "ML"
            },
            {
                name: "WEIGHT",
                value: weight,
                unit: "KG",
                goal: Math.round(projectedWeight),
                goalUnit: "KG"
            }

        ]


        res.status(200).json(createResponse(true,Report,null))




    } catch (error) {
        res.status(500).json(createResponse(false, "something went wrong", error.message))
    }

}



module.exports = reportController;

