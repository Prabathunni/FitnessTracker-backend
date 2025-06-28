const userModel = require('../model/userModel')

exports.addWaterIntakecontroller = async (req, res) => {

    console.log("In add water controller");

    try {
        const { date, waterTakenInMl } = req.body;
        if(!date || !waterTakenInMl){
            res.status(401).json(createResponse(false, "Provide all Inputs",null))    
        }

        const addDate = new Date(date)
        const user = await userModel.findById(req.userId)
        user.waterIntake.push({
            date: addDate,
            waterTakenInMl
        })
        await user.save()

        res.status(200).json(createResponse(true,user,null))

    } catch (error) {
        res.status(500).json(createResponse(false, "something went wrong", error.message))

    }


}


exports.getWaterByDate = async (req, res) => {
    console.log("Inside get Water by Date controller");

    try {
        const{date} =req.body;
        if(!date){
         res.status(403).json(createResponse(false,"povide date",null))
           
        }

        
        const user = await userModel.findById(req.userId)
        const userWaterArr = user.waterIntake;
        if(userWaterArr.length==0){
          res.status(403).json(createResponse(false,"No Records Found",null))
        }

        const userWaterIntakes = filterByDate(userWaterArr,date)
        if(userWaterIntakes.length==0){
          res.status(403).json(createResponse(false,"No Records Found",null))
        }

        res.status(200).json(createResponse(true,userWaterIntakes,null))


        
    } catch (error) {
        res.status(500).json(createResponse(false,"something went wrong",error.message))
        
    }
    
}
exports.getWaterByLimit = async (req, res) => {

}
exports.getGoalWaterIntake = async (req, res) => {

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