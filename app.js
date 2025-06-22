const express = require('express')
const app = express()
const cors = require('cors')
require('./config/db')
require('dotenv').config()
const cookieParser = require('cookie-parser')


//middlewares
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended: true}))




app.get('/', (req,res)=>{
    res.send('HEEEEELLOOOOOOO fitness tracker server')
})

app.listen(4000, ()=>{
    console.log("Server running at port address ");
    
})