const userModel = require('../model/userModel')

exports.getAllUsersContoller = async (req, res) => {
    console.log("Inside get all users Controller");

    try {

        const users = await userModel.find()
        if (users.length == 0) {
            res.status(404).json(createResponse(false, "No Users Found", null))
        }

        res.status(200).json(createResponse(true, users, null))

    } catch (error) {
        res.status(500).json(createResponse(false, "something went wrong", error.message))
    }


}

exports.getaUserByIdController = async (req, res) => {
    console.log("Inside get a  User controller");

    try {
        const user = await userModel.findById(req.params.id);

        if (!user) {
            res.status(404).json(createResponse(false, "User not Found", null))
        }

        res.status(200).json(createResponse(true, user, null))

    } catch (error) {
        res.status(500).json(createResponse(false, "something went wrong", error.message))
    }

}

exports.deleteUser = async (req, res) => {
    console.log("Inside delete User controller");

    try {
        const user = await userModel.findByIdAndDelete(req.params.id);

        if (!user) {
            res.status(404).json(createResponse(false, "User not Found", null))
        }

        res.status(200).json(createResponse(true, "User Deleted successfully", null))



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