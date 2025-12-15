const express = require("express");
//a router object to define routes
const router = express.Router();

//getting user model schema
const User = require("../Models/user");

//saving data of user
//use likt this: http://localhost:3000/user/signup or url/user/signup
router.post("/signup", async (req, res) => {
  try {
    //getting data from request body
    const data = req.body;
    // creating a new User document using the schema
    const newUser = new User(data);
    //saving new user data to db and getting response
    const response = await newUser.save();
    res.status(200).json({ userAdded: response });
  } catch (error) {
    console.log("Error while saving user data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//login route : /user/login
router.post("/login",async(req,res)=>{
  try{
    //getting email and password of the user
    const{email,password}=req.body;
    //getting the user by email
    const user=await User.findOne({email:email})
    //if user is not found or either email or password is wrong
    //? write checking/compare password logic later
    if(!user){
      return res.status(401).json("Invalid email or password")
    }
    //is user is found
    res.status(200).json({message:"User login successfully!"})
  }catch (error) {
    console.log("Error while saving user data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
})

//getting user profile

module.exports = router;
