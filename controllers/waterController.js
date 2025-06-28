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

}
exports.getWaterByLimit = async (req, res) => {

}
exports.getGoalWaterIntake = async (req, res) => {

}



function createResponse(ok, response, error) {
    return ({
        ok,
        response,
        error
    })
}