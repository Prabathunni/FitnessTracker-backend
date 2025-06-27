const calorieIntakeModel = require('../model/calorieIntakeModel');
const userModel = require('../model/userModel');
require('dotenv').config()
const nutritionData = require('../Data/nutritionData.json')


exports.addCalorieIntake = async (req, res) => {
    console.log("Inside add calorie controller..");

    const { item, quantity, unit, date } = req.body;
    
    try {

        let quantityInGrams = 0;

        switch(unit){
            case 'g':
                quantityInGrams=quantity
                break;
            case 'ml':
                quantityInGrams=quantity
                break;
            case 'kg':
                quantityInGrams=quantity*1000
                break;
            case 'l':
                quantityInGrams=quantity*1000
                break;
            default:
                return res.status(400).json(createResponse(false,"Unit not matched",null))
        }
        
        const arrageString = (str)=> str.toLowerCase().replace(/[^a-z]/g, '')  
        const searchItem = arrageString(item)

        const foodItem = nutritionData.filter((item)=>(
            arrageString(item.name).includes(searchItem)
        ))

        if(foodItem.length===0){
            res.status(404).json(createResponse(false,"Food item not found",null))
        }


       const calorieInTake = Math.round((foodItem[0].calories / foodItem[0].serving_size_g )*quantityInGrams)
       const proteinInTake = Math.round((foodItem[0].protein_g / foodItem[0].serving_size_g )*quantityInGrams)

       const newUserCalorie =new calorieIntakeModel({
            item,
            quantity,
            unit,
            date:new Date(date),
            calorieInTake,
            proteinInTake,
            user: req.userId
       })
       await newUserCalorie.save()

       const user =await userModel.findById(req.userId)
       user.calorieIntake.push(newUserCalorie._id)
       await user.save()

       res.status(200).json(createResponse(true,"Calorie Added Successfully",null))


    } catch (error) {
        console.log(error);
        res.status(500).json(createResponse(false, "something went wrong", error.message))

    }

}

exports.getCalorieByDate = async (req, res) => {
    console.log("inside get calorie by Date controller");
    const { date } = req.body;
    
    try {
        const searchDate = new Date(date)
        const year = searchDate.getFullYear()
        const month = searchDate.getMonth()
        const day = searchDate.getDate()

        const startofThDay = new Date(year, month, day, 0, 0, 0, 0)
        const endOfTheDay = new Date(year, month, day, 23, 59, 59, 999);

        const userCalorieDocument =  await calorieIntakeModel.find({
            user: req.userId,
            date: { $gte:startofThDay, $lte: endOfTheDay }
        })

        if(userCalorieDocument.length==0){
            res.status(404).json(createResponse(false,"No Calorie Data Found on that Date",null))
        }

        res.status(200).json(userCalorieDocument)
        
    } catch (error) {
        res.status(500).json(createResponse(false,"Something went wrong",error.message))
        
    }
    
 }


 exports.getCalorieByLimit = async (req, res) => { }








exports.deleteCalorie = async (req, res) => { }
exports.getGoalCalorie = async (req, res) => { }



function createResponse(ok, response, error) {
    return ({
        ok,
        response,
        error
    })
}