const express = require('express')
const router = express.Router();
const { registerController, loginController, logoutUserContoller } = require('../controllers/userController');
const jwtMiddleware = require('../middleware/jwtMiddleware');
const {verifyToken, protectedRoutesController } = require('../controllers/verifyController');




router.post('/register', registerController)

router.post('/login', loginController)


router.get('/checklogin', jwtMiddleware, protectedRoutesController )

router.get('/verifytoken', verifyToken )

router.get('/logout', logoutUserContoller)




module.exports = router