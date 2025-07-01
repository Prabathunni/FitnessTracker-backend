// const muscleGroupModel = require('../model/muscleGroupModel')

// const allMuscleGroup = async(req,res)=>{
//     console.log("in all muscle group controller...");

//     try {

//         const allMuscleGroups = await muscleGroupModel.find()
//         if(allMuscleGroup.length==0)[
//             res.status(404).json("Muscle groups Not Found")
//         ]
//         res.status(200).json(allMuscleGroups)
        
//     } catch (error) {
//         res.status(500).json({
//             message:error.message,
//             error
//         })
        
//     }
    
// }

// module.exports = allMuscleGroup