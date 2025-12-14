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
module.exports = router;
