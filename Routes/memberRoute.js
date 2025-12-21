const express = require("express");
const router = express.Router();

const Member = require("../Models/member");
const { jwtAuthMiddleWare } = require("../jwt");

//adding the member
router.post("/register", jwtAuthMiddleWare, async (res, res) => {
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
module.exports=router;
