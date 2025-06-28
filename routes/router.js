const express = require('express')
const router = express.Router();
const { registerController, loginController, logoutUserContoller } = require('../controllers/userController');
const jwtMiddleware = require('../middleware/jwtMiddleware');
const {verifyToken, protectedRoutesController } = require('../controllers/verifyController');
const allMuscleGroup = require('../controllers/muscleGroupController');
const { addCalorieIntake, getCalorieByDate, getCalorieByLimit, getGoalCalorie } = require('../controllers/CalorieController');
const { addSleepController, getSleepByDate } = require('../controllers/SleepController');



// register
router.post('/register', registerController)
// login
router.post('/login', loginController)

// protected routing checkup   -----need to go through again!!!!!
router.get('/checklogin', jwtMiddleware, protectedRoutesController )

// verify token 
router.get('/verifytoken', verifyToken )

// logout the user
router.get('/logout',jwtMiddleware, logoutUserContoller)

// get All muscle groups
router.get('/musclegroups',jwtMiddleware, allMuscleGroup)


// -----------------------CALORIE ROUTER--------------------------------
// Add Calorie
router.post('/addcalorie',jwtMiddleware, addCalorieIntake)

// Get Calorie By Date
router.post('/caloriebydate',jwtMiddleware, getCalorieByDate)

// Get Calorie By limit
router.post('/caloriebylimit',jwtMiddleware, getCalorieByLimit)

// Get GoalCalorie
router.get('/goalcalorie',jwtMiddleware, getGoalCalorie)


// ---------------------SLEEP ROUTER-----------------------
// ADD sleep
router.post('/addsleep',jwtMiddleware,addSleepController)

// Get sleep by Date
router.post('/sleepbydate',jwtMiddleware,getSleepByDate)




module.exports = router