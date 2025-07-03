const jwt = require('jsonwebtoken')
require('dotenv').config()


exports.verifyToken = async (req,res) =>{
    console.log("inside verify token handler");
    
    const token = req.cookies.token;

    if(!token) return res.send(400).json({ valid: false })
    
    jwt.verify(token,process.env.jwt_secret, (err, decoded)=>{
        if(err) return res.status(401).json({ valid:false, err })

        res.status(200).json({ valid: true })
    })
}



// exports.protectedRoutesController = (req, res) => {
//     res.json({ message: "Access granted", userId: req.userId });
// }

