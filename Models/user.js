const mongoose = require("mongoose");
const bycrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, //removes extra spaces from start & end : " hello " → "hello"
  },
  address: {
    type: "String",
    required: true,
  },
  gymName: {
    type: String,
    required: true,
  },
  gymAddress: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, //automatically converts email to lowercase
  },
  password: {
    type: String,
    required: true,
    select: false, // security
  },
  phone: { type: Number, required: true },
  role: { type: String, enum: ["owner", "staff"], required: true },
  isActive: { type: Boolean, default: true },
});

//hashing the password of the user before saving it to the db
userSchema.pre("save", async (next) => {
  const user = this; //basically 'this' here is the existing record/schema of the user
  //first we will check is password being updated or not because it will be running on ever save, so if user is only updating name,address etc
  //in that case we won't hash password again if it has not being changed
  if (!user.isModified("password")) return next();
  try {
    //generating hash password

     //1: generating salt (here genSalt(10) means 10 round salt, generates random string)
     const salt=await bycrypt.genSalt(10); // we can also do this: const salt="this is a salt"; but not secure at all
     //console.log("salt:",salt) // $2b$10$UjvORRbdKDQVh3aXB3f6wO

     //2: hashing password
     const hashedPassword=await bycrypt.hash(user.password,salt)

     //3: overrides the plan password with the hashed one
     user.password=hashedPassword;

     next(); //means we have done processing now you can save in db/do further tasks
  } catch (err) {
    return next(err);
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
