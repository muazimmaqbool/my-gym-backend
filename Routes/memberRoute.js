const express = require("express");
const router = express.Router();

const Member = require("../Models/member");
const { jwtAuthMiddleware } = require("../jwt");

//adding the member
router.post("/register", jwtAuthMiddleware, async (req, res) => {
  try {
    const data = req.body;
    const newMember = new Member(data);
    const response = await newMember.save();
    res.status(200).json({ newMemberAdded: response });
  } catch (err) {
    console.log("Error while registering new member:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


//getting all members
router.get("/all",jwtAuthMiddleware,async(req,res)=>{
    try{
        const allMembers=await Member.find()
        // console.log("allMembers:",allMembers)
        if(allMembers.length===0){
            res.status(200).json({message:"No record found"})
        }
        res.status(200).json(allMembers)
    }catch (err) {
    console.log("Error while registering new member:", err);
    res.status(500).json({ error: "Internal server error" });
  }
})



module.exports = router;