const calorieIntakeModel = require('../model/calorieIntakeModel');
const userModel = require('../model/userModel');
require('dotenv').config()
const nutritionData = require('../Data/nutritionData.json')


exports.addCalorieIntake = async (req, res) => {
    console.log("Inside add calorie controller..");

    const { item, quantity, unit, date } = req.body;

    try {

        let quantityInGrams = 0;

        switch (unit) {
            case 'g':
                quantityInGrams = quantity
                break;
            case 'ml':
                quantityInGrams = quantity
                break;
            case 'kg':
                quantityInGrams = quantity * 1000
                break;
            case 'l':
                quantityInGrams = quantity * 1000
                break;
            default:
                return res.status(400).json(createResponse(false, "Unit not matched", null))
        }

        const arrageString = (str) => str.toLowerCase().replace(/[^a-z]/g, '')
        const searchItem = arrageString(item)

        const foodItem = nutritionData.filter((item) => (
            arrageString(item.name).includes(searchItem)
        ))

        if (foodItem.length === 0) {
            res.status(404).json(createResponse(false, "Food item not found", null))
        }


        const calorieInTake = Math.round((foodItem[0].calories / foodItem[0].serving_size_g) * quantityInGrams)
        const proteinInTake = Math.round((foodItem[0].protein_g / foodItem[0].serving_size_g) * quantityInGrams)



        const newUserCalorie = new calorieIntakeModel({
            item,
            quantity,
            unit,
            date: new Date(date),
            calorieInTake,
            proteinInTake,
            user: req.userId
        })
        await newUserCalorie.save()

        const user = await userModel.findById(req.userId)
        user.calorieIntake.push(newUserCalorie._id)
        await user.save()

        res.status(200).json(createResponse(true, "Calorie Added Successfully", null))


    } catch (error) {
        console.log(error);
        res.status(500).json(createResponse(false, "something went wrong", error.message))

    }

}

exports.getCalorieByDate = async (req, res) => {
    console.log("inside get calorie by Date controller");
    const { date } = req.body;
    if (!date) {
        res.status(404).json(createResponse(false, "provide date,sleep In Hr", null))
    }


    try {
        const searchDate = new Date(date)
        const year = searchDate.getFullYear()
        const month = searchDate.getMonth()
        const day = searchDate.getDate()

        const startofThDay = new Date(year, month, day, 0, 0, 0, 0)
        const endOfTheDay = new Date(year, month, day, 23, 59, 59, 999);

        const userCalorieDocument = await calorieIntakeModel.find({
            user: req.userId,
            date: { $gte: startofThDay, $lte: endOfTheDay },
        })

        if (userCalorieDocument.length == 0) {
            res.status(404).json(createResponse(false, "No Calorie Data Found on that Date", null))
        }

        res.status(200).json(userCalorieDocument)

    } catch (error) {
        res.status(500).json(createResponse(false, "Something went wrong", error.message))

    }

}

exports.getCalorieByLimit = async (req, res) => {
    console.log("inside get calorie by limit");

    const { limit } = req.body;

    try {

        switch (limit) {
            case 'all':
                const userCalorieDocument = await calorieIntakeModel.find({ user: req.userId })
                providValues(userCalorieDocument)
                break;

            case 'last7days':
                const today = new Date()

                const startedFrom7Days = new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    today.getDate() - 7,
                    0, 0, 0, 0
                )

                const endOfTheDay = new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    today.getDate(),
                    23, 59, 59, 999
                )

                const userCaloriesByLimit = await calorieIntakeModel.find({
                    user: req.userId,
                    date: { $gte: startedFrom7Days, $lte: endOfTheDay }
                })

                providValues(userCaloriesByLimit)
                break;

            case 'last10days':
                const now = new Date()
                const startedFrom10Days = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate() - 10,
                    0, 0, 0, 0
                )

                const endofDay = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate(),
                    23, 59, 59, 999
                )

                console.log(startedFrom10Days.toISOString(), endofDay.toISOString());


                const userCalorieDocumentLimit10 = await calorieIntakeModel.find({
                    user: req.userId,
                    date: { $gte: startedFrom10Days, $lte: endofDay }
                })

                providValues(userCalorieDocumentLimit10)
                break;

            default:
                return res.status(404).json(createResponse(false, "provide valid Limit", null))
        }


        // short function for above case statements
        function providValues(docObject) {
            if (docObject.length == 0) {
                return res.status(404).json(createResponse(false, "No Calorie Data found", null))
            }
            return res.status(200).json(docObject)
        }

    } catch (error) {
        res.status(500).json(createResponse(false, "something went wrong", error.message))
    }

}

    // CURRENTLY UPDATION FOR LATER...
exports.deleteCalorie = async (req, res) => {
    // 
}

// bug found-----needed goal calorie even user not provided calorie details
exports.getGoalCalorie = async (req, res) => {
    console.log("inside get Goal calorie controller...");

    try {


        // ----------------------------for GOAL CALORIE Fetching
        const activityFactors = {
            sedentary: 1.2,
            light: 1.375,
            moderate: 1.55,
            active: 1.725,
            very_active: 1.9
        };

        const userData = await userModel.findById(req.userId)
        const weightSortArr = userData.weight.sort((a, b) => new Date(b.date) - new Date(a.date))[0]  // descending ordering the array to get latest weight on basis of date
        const heightSortArr = userData.height.sort((a, b) => new Date(b.date) - new Date(a.date))[0]  // descending ordering the array to get latest weight on basis of date

        const weight = weightSortArr.weight;
        const height = heightSortArr.height;
        const gender = userData.gender;
        const goal = userData.goal;
        const age = userData.age;
        const activity = userData.activityLevel;
        const activityMultiplier = activityFactors[activity];


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

        res.status(200).json({ goalCalorieTarget: Math.round(goalCalorieTarget) })



        if (!activityMultiplier) {
            return res.status(400).json(createResponse(false, "Invalid activity level", null));
        }
        if (userCalories.length == 0) {
            res.status(404).json(createResponse(false, "No calorie intake today", null))
        }
        if (weightSortArr.length == 0 || heightSortArr.length == 0 || goal == "" || gender == "") {
            res.status(404).json(createResponse(false, "Please provide the weight/height/goal/gender", null))
        }


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