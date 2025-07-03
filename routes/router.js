const express = require('express')
const router = express.Router();
const { registerController, loginController, logoutUserContoller, adminRegisterController, adminLoginController, fetchUserDetailsController } = require('../controllers/userController');
const jwtMiddleware = require('../middleware/jwtMiddleware');
const {verifyToken, protectedRoutesController } = require('../controllers/verifyController');
const allMuscleGroup = require('../controllers/muscleGroupController');
const { addCalorieIntake, getCalorieByDate, getCalorieByLimit, getGoalCalorie } = require('../controllers/CalorieController');
const { addSleepController, getSleepByDate, getSleepByLimit, getGoalSleep } = require('../controllers/SleepController');
const { addWaterIntakecontroller, getWaterByDate, getWaterByLimit, getGoalWaterIntake } = require('../controllers/waterController');
const { addWeightController, getWeightbyDate, getWeightByLimit, getGoalWeigtht } = require('../controllers/weightContoller');
const checkAdminToken = require('../middleware/checkAdminToken');
const { addMuscleGroupController, addExercise, getWorkoutById, getAllWorkouts, getAllExerciseById, DeleteExercisebyId, UpdateAExerciseById } = require('../controllers/WorkoutController');
const { getAllUsersContoller, deleteUser } = require('../controllers/adminUserController');
const reportController = require('../controllers/reportController');



// -------------------------------------------------USER AUTH----------------------------
// register
router.post('/register', registerController)
// login
router.post('/login', loginController)

// // protected routing checkup   -----need to go through again!!!!!
// router.get('/checklogin', jwtMiddleware, protectedRoutesController )

// verify token 
router.get('/verifytoken', verifyToken )

// logout the user
router.get('/logout',jwtMiddleware, logoutUserContoller)


// fetch user details for header
router.get('/userfetch', jwtMiddleware, fetchUserDetailsController)

// --------------------------------------------------------------------------------------


// ####################### validation required for later..............
// get All muscle groups
// router.get('/musclegroups',jwtMiddleware, allMuscleGroup)


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

// get goal weight
router.post('/getgoalweight', jwtMiddleware, getGoalWeigtht)


// _________________________________________OVERALL REPORT 

router.get('/report',jwtMiddleware , reportController)


// __________________________________________WOKROUT FOR USERS
// get ALL musclegroups
router.get('/workout', jwtMiddleware, getAllWorkouts)
// get a workout by id
router.get('/workout/:id', jwtMiddleware, getWorkoutById)





// -----------------------------------------------------ADMIN AUTH------------------------
router.post('/registeradmin',adminRegisterController)
router.post('/loginadmin',adminLoginController)

// ____________________workout routes for admin____________
// add musclegroups
router.post('/workout', checkAdminToken, addMuscleGroupController)

// add Exercise
router.post('/workout/:id', checkAdminToken, addExercise)

// get a musclegroups
router.get('/workout/:id', checkAdminToken, getWorkoutById)

// get ALL musclegroups
router.get('/workout', checkAdminToken, getAllWorkouts)

// get ALL exercises by workout id
router.get('/workout/:id/exercises', checkAdminToken, getAllExerciseById)

// delete  exercises by  id ~ workout id 
router.delete('/workout/:workoutId/exercises/:exerciseId', checkAdminToken, DeleteExercisebyId)

// update  exercises by  id ~ workout id 
router.put('/workout/:workoutId/exercises/:exerciseId', checkAdminToken, UpdateAExerciseById)


// _______________________________USER ROUTES ~ADMIN____________________________
// get all USers
router.get('/users', checkAdminToken, getAllUsersContoller)

// delete user by id
router.delete('/users/:id', checkAdminToken, deleteUser)

// get a user by id----------------------------------------------------valid for later----
// router.get('/users', checkAdminToken, getAllUsersContoller)



module.exports = router