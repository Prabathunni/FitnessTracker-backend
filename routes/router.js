const express = require('express')
const router = express.Router();
const { registerController, loginController, logoutUserContoller, adminRegisterController, adminLoginController } = require('../controllers/userController');
const jwtMiddleware = require('../middleware/jwtMiddleware');
const {verifyToken, protectedRoutesController } = require('../controllers/verifyController');
const allMuscleGroup = require('../controllers/muscleGroupController');
const { addCalorieIntake, getCalorieByDate, getCalorieByLimit, getGoalCalorie } = require('../controllers/CalorieController');
const { addSleepController, getSleepByDate, getSleepByLimit, getGoalSleep } = require('../controllers/SleepController');
const { addWaterIntakecontroller, getWaterByDate, getWaterByLimit, getGoalWaterIntake } = require('../controllers/waterController');
const { addWeightController, getWeightbyDate, getWeightByLimit } = require('../controllers/weightContoller');



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

// Get sleep by limit
router.post('/sleepbylimit',jwtMiddleware,getSleepByLimit)

// Get sleep by Goal
router.get('/sleepbygoal',jwtMiddleware,getGoalSleep)


// -------------------------waterintake---------
// add water
router.post('/addwater',jwtMiddleware,addWaterIntakecontroller)

// get water by date
router.post('/getwaterbydate',jwtMiddleware,getWaterByDate)

// get water by limit
router.post('/getwaterbylimit',jwtMiddleware,getWaterByLimit)

// get goal Water
router.get('/getgoalwater',jwtMiddleware , getGoalWaterIntake)


// -----------------------------weight ROUTER--------------------
// add weight
router.post('/addweight', jwtMiddleware, addWeightController)

// get weight by date
router.post('/getweightbydate', jwtMiddleware, getWeightbyDate)

// get weight by limit
router.post('/getweightbylimit', jwtMiddleware, getWeightByLimit)




// ------------------ADMIN------------------------
router.post('/registeradmin',adminRegisterController)
router.post('/loginadmin',adminLoginController)



module.exports = router