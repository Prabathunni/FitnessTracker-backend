const express = require('express')
const router = express.Router();
const { registerController, loginController, logoutUserContoller } = require('../controllers/userController');
const jwtMiddleware = require('../middleware/jwtMiddleware');
const {verifyToken, protectedRoutesController } = require('../controllers/verifyController');
const allMuscleGroup = require('../controllers/muscleGroupController');
const setCalorieInTake = require('../controllers/CalorieController');



// register
router.post('/register', registerController)
// login
router.post('/login', loginController)

// protected routing checkup
router.get('/checklogin', jwtMiddleware, protectedRoutesController )

// verify token 
router.get('/verifytoken', verifyToken )

// logout the user
router.get('/logout',jwtMiddleware, logoutUserContoller)


// get All muscle groups
router.get('/musclegroups',jwtMiddleware, allMuscleGroup)

// setUp CAlorieIntake
router.post('/calories',jwtMiddleware, setCalorieInTake)




module.exports = router