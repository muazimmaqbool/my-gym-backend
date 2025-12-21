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

//getting all members:
/*
adding queries as well:
/members/all?search=zub
/members/all?paymentStatus=paid
(multiple queries)
/members/all?membershipType=monthly&isActive=true 
/members/all?search=sara&paymentStatus=pending
*/
router.get("/all", jwtAuthMiddleware, async (req, res) => {
  try {
    //getting queries from header/params
    const { search, paymentStatus, membershipType, isActive } = req.query;

    const query = {};

    //searching by name
    if (search) {
      query.name = { $regex: search, $options: "i" };
      /*
            -> $regex: enables partial text search
            -> $options: "i" → case-insensitive
            */
    }
    //filter by payment status
    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }
    //filter by membership
    if (membershipType) {
      query.membershipType = membershipType;
    }
    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    const members = await Member.find(query).sort({ createdAt: -1 });
    /*
        ->Member.find(query)
            find() is a MongoDB read operation
            query is a plain JavaScript object that contains conditions
            MongoDB returns only those documents that match all conditions
            example: 
            query = {
            paymentStatus: "paid",
            isActive: true
            }; fetch members whose paymentStatus is paid AND isActive is true

        ->.sort({ createdAt: -1 }) : sorts the result after filtering.
            -1 → descending order
            Latest records come first
            Oldest records go last
            So the final meaning:
            “Get all matching members, ordered from newest to oldest
        
            Note: .sort({createdAt:-1}) is optional
                */
    //  console.log("members:",members)

    if (members.length === 0) {
      res.status(200).json({ message: "No record found" });
    }
    res.status(200).json(members);
  } catch (err) {
    console.log("Error while registering new member:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//deleting member
router.delete(`/:memberId`, jwtAuthMiddleware, async (req, res) => {
  try {
    //getting member id
    const memberId = req.params.memberId;

    //deleting
    const response = await Member.findByIdAndDelete(memberId);
    if (!response) {
      res.status(404).json({ error: "Member not found" });
    }
    res.status(200).json({ message: "Member deleted successfully" });
  } catch (err) {
    console.log("Error while registering new member:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//updating data of the memeber
router.put("/:memberId", jwtAuthMiddleware, async (req, res) => {
  try {
    const memberId = req.params.memberId;
    const updatedData = req.body;
    const response = await Member.findByIdAndUpdate(memberId, updatedData, {
      new: true,
      runValidators: true,
    });
    if (!response) {
      return res.status(403).json({ error: "Member not found" });
    }
    res.status(200).json({ message: "Member updated" });
  } catch (error) {
    console.log("Error while updating member data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//get member by id
router.get("/:memberId", jwtAuthMiddleware, async (req, res) => {
  try {
    const memberId = req.params.memberId;
    const memberFound=await Member.findById(memberId);
     if (!memberFound) {
      return res.status(403).json({ error: "Member not found" });
    }
    res.status(200).json({ memberFound});
  } 
  catch (error) {
    console.log("Error while updating member data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
