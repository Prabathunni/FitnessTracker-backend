const userModel = require('../model/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()



exports.registerController = async (req, res) => {
    console.log("REQ BODY:", req.body);
    console.log("in register controller");
    try {

        const { name, email, password, gender, age, weightInKg, heightInCm, goal, calorieIntake, activityLevel, sleep, steps, workouts } = req.body;

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

        if (existingUser) {

            let isMatch = await bcrypt.compare(password, existingUser.password)

            if(isMatch){
                const token = jwt.sign({userId: existingUser._id}, process.env.jwt_secret)
                res.status(200).json({
                    token,existingUser
                })

            }else{
                res.status(404).json("Invalid Password...")
             
            }
            
            
        } else {
            res.status(401).json("Account does not exist...")
        }

    } catch (error) {

        res.status(500).json(error)

    }

}