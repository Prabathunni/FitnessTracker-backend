const userModel = require('../model/userModel')
const adminModel = require('../model/adminModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
require('cookie-parser')




exports.registerController = async (req, res) => {
    console.log("REQ BODY:", req.body);
    console.log("in register controller");
    try {

        const { name, email, password, gender, age, weightInKg, heightInCm, goal, calorieIntake, activityLevel, sleep, workouts } = req.body;

        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            res.status(406).json("User Already Exists")
        } else {

            const encryptedPassword = await bcrypt.hash(password, 10)

            const newUser = new userModel({
                name,
                email,
                password: encryptedPassword,
                weight: [
                    {
                        weight: weightInKg,
                        unit: "kg",
                        date: Date.now()
                    }
                ],
                height: [
                    {
                        height: heightInCm,
                        unit: "cm",
                        date: Date.now()
                    }
                ],
                goal,
                gender,
                age,
                activityLevel,

            })


            await newUser.save()
            res.status(201).json("User registered successfully", newUser)

        }


    } catch (error) {

        res.status(400).json({ message: "sorry error", error })

    }
}


exports.loginController = async (req, res) => {
    console.log("in login controller...");
    const { email, password } = req.body;

    try {

        const existingUser = await userModel.findOne({ email })
        console.log(existingUser.status);


        if (existingUser) {

            let isMatch = await bcrypt.compare(password, existingUser.password)

            if (isMatch) {

                if (existingUser.status === "banned") {
                    return res.status(404).json("You Are A Banned User!")
                }

                const token = jwt.sign({ userId: existingUser._id }, process.env.jwt_secret) // token setup

                res.cookie("token", token, {
                    httpOnly: true,
                    secure: false,
                    maxAge: 24 * 60 * 60 * 1000 // 1 day
                })                   //cookie set up


                res.status(200).json("Logging In...")

            } else {
                res.status(404).json("Invalid Password...")

            }


        } else {
            res.status(404).json("Account does not exist...")
        }

    } catch (error) {

        res.status(500).json(error.message)

    }

}


exports.logoutUserContoller = (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
        })

        res.status(200).json("logout successfull")


    } catch (error) {

        res.status(500).json({ message: "Something Went Wrong", error })

    }
}

// Provide user Details for profile
exports.fetchUserDetailsController = async (req, res) => {
    console.log("Inside fetch user Details controller");
    try {

        const user = await userModel.findById(req.userId)
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json("Please Login");
        }

    } catch (error) {
        res.status(500).json(error)
    }
}


// PROFILE UPDATEIONS
exports.updateUSerDetailsController = async (req, res) => {
    console.log("inside update user details controller");
    try {
        const { age, goal, gender, activityLevel } = req.body;

        const existingUser = await userModel.findById(req.userId);

        const isSameData =
            (age === undefined || existingUser.age === age) &&
            (goal === undefined || existingUser.goal === goal) &&
            (gender === undefined || existingUser.gender === gender) &&
            (activityLevel === undefined || existingUser.activityLevel === activityLevel);

        if (isSameData) {
            return res.status(200).json({ message: 'No changes Made!' });
        }

        const updatedUser = await userModel.updateOne(
            { _id: req.userId },
            {
                $set: {
                    ...(age !== undefined && { age }),
                    ...(goal !== undefined && { goal }),
                    ...(gender !== undefined && { gender }),
                    ...(activityLevel !== undefined && { activityLevel }),
                }
            }
        );

         res.status(200).json({ message: 'Profile updated successfully', updatedUser });

    } catch (error) {
        res.status(500).json(error)
    }
}



//____________________________ADMIN CONTROLLER __________________________________

exports.adminRegisterController = async (req, res) => {
    console.log("in register controller");
    try {

        const { name, email, password } = req.body;

        const existingUser = await adminModel.findOne({ email });

        if (existingUser) {
            res.status(406).json("Existing Admin, Please Login...")
        } else {

            const encryptedPassword = await bcrypt.hash(password, 10)

            const newAdmin = new adminModel({
                name,
                email,
                password: encryptedPassword,
            })


            await newAdmin.save()
            res.status(201).json("Admin Authenticated", newAdmin)

        }


    } catch (error) {

        res.status(400).json({ message: "sorry error", error })

    }
}

// admin LOGIN CONTROLLER
exports.adminLoginController = async (req, res) => {
    console.log("Inside Admin login controller...");
    const { email, password } = req.body;

    try {

        const existingUser = await adminModel.findOne({ email })

        if (existingUser) {

            let isMatch = await bcrypt.compare(password, existingUser.password)

            if (isMatch) {
                const token = jwt.sign({ userId: existingUser._id }, process.env.jwt_secret) // token setup

                res.cookie("token", token, {
                    httpOnly: true,
                    secure: false,
                    maxAge: 24 * 60 * 60 * 1000 // 1 day
                })                   //cookie set up


                res.status(200).json({
                    token, existingUser
                })

            } else {
                res.status(404).json("Invalid Password...")

            }


        } else {
            res.status(404).json("Unauthenticated Admin")
        }

    } catch (error) {
        res.status(500).json(error.message)

    }


}

// logout Admin
exports.logoutAdminController = async (req, res) => {
    console.log("inside logout controller");
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
        })

        res.status(200).json("logout successfull")


    } catch (error) {
        res.status(500).json(createResponse(false, "something went wrong", error.message))
    }
}



