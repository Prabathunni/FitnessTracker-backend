const express = require('express')
const router = express.Router();
const { registerController, loginController, logoutUserContoller } = require('../controllers/userController');
const jwtMiddleware = require('../middleware/jwtMiddleware');




router.post('/register', registerController)

router.post('/login', loginController)


router.get('/checklogin', jwtMiddleware, (req, res) => {
    res.json({ message: "Access granted", userId: req.userId });
})


router.post('/logout', jwtMiddleware, logoutUserContoller )





module.exports = router