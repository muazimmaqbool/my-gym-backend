const express=require("express")
const cors=require("cors")
const app=express()
const db=require("./db")
const bodyParser=require("body-parser")
require("dotenv").config()

//for now enabling all requests
app.use(cors())

//here it will convert the json string/data to js object and save it inside: req.body
app.use(bodyParser.json())

const PORT=process.env.PORT || 3000

//importing router files

//using routes

//just for testing: http://localhost:3000/
app.get("/",(req,res)=>{
    res.send("Welcome to gym app backend...")
})

app.listen(PORT,()=>{
    console.log("server is running on: http://localhost:3000/")
})