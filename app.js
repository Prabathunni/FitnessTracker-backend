const express = require('express')
const app = express()
const cors = require('cors')
require('./config/db')
require('dotenv').config()
const router = require('./routes/router')
const cookieParser = require('cookie-parser')


//middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:'http://localhost:5000',  //seting up the frontend default port address for cross over 
    credentials:true
}))


app.use(router)

app.get('/', (req,res)=>{
    res.send('HEEEEELLOOOOOOO fitness tracker server')
})

app.listen(4000, ()=>{
    console.log("Server running at port address http://localhost:4000/");
    
})