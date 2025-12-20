const express = require("express");
//a router object to define routes
const router = express.Router();

//getting user model schema
const User = require("../Models/user");
const { generateToken, jwtAuthMiddleware } = require("../jwt");

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
router.post("/login", async (req, res) => {
  try {
    //getting email and password of the user
    const { email, password } = req.body;
    //getting the user by email
    const user = await User.findOne({ email: email });
    //if user is not found or either email or password is wrong
    //? write checking/compare password logic later
    if (!user) {
      return res.status(401).json("Invalid email or password");
    }
    // console.log("user found:", user);
    //payload for jwt token
    const jwtPayload = {
      id: user?._id,
      name: user?.name,
    };
    const token = generateToken(jwtPayload);
    //is user is found
    res.status(200).json({ message: "User login successfully!", token: token });
  } catch (error) {
    console.log("Error while saving user data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//getting user profile
router.get("/profile", jwtAuthMiddleware, async (req, res) => {
  try {
    const userData = req.userData; //contains payload data of jwt token
    //console.log("userData:",userData)
    const userId = userData.id;
    //getting user details by user id
    const user = await User.findById(userId);
    res.status(200).json({ user });
  } catch (error) {
    console.log("Error while saving user data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//route to update the profile
router.put("/:userID", jwtAuthMiddleware, async (req, res) => {
  try {
    //getting the user id from paramters/query
    const userID = req.params.userID;
    //getting data to update which is passed via request body
    const updatedData = req.body;
    //saving data
    const response = await User.findByIdAndUpdate(userID, updatedData, {
      new: true, //returns updated data
      runValidators: true,
    });
    if(!response){
      return res.status(403).json({error:"User not found!"})
    }
    res.status(200).json({message:"updated profile successfully"})
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
