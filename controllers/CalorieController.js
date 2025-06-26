const calorieIntakeModel = require('../model/calorieIntakeModel');
const userModel = require('../model/userModel');


const setCalorieInTake = async(req,res)=>{
    console.log("Inside setCalorieIntake controller");

    const { item, quantity, unit, date} = req.body;
    try {

        const userCalorieIntake = new calorieIntakeModel({
            item,
            quantity,
            unit,
            date,
            user: req.userId
        })
        await userCalorieIntake.save()

       const user = await userModel.findById(req.userId)
       user.calorieIntake.push(userCalorieIntake._id)

       await user.save()

       res.status(200).json({
        message:"Done",
        user
       })
        
    } catch (error) {
        console.log(error);  
        res.status(500).json(error.message)
        
    }
    
}

module.exports = setCalorieInTake