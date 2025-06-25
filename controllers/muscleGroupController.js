const muscleGroupModel = require('../model/muscleGroupModel')

const allMuscleGroup = async(req,res)=>{
    console.log("in all muscle group controller...");

    try {

        const allMuscleGroups = await muscleGroupModel.find()
        res.status(200).json(allMuscleGroups)
        
    } catch (error) {
        res.status(500).json({
            message:"Error broo",
            error
        })
        
    }
    
}

module.exports = allMuscleGroup