const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
//here normal function is used and not arrow function because: arrow functions do NOT have their own this, so this is undefined, so const user=this; will then show isModified is not function error

//un newer Mongoose versions, when you use an async middleware: Mongoose does NOT pass next anymore
userSchema.pre('save', async function(){
  const user = this; //basically 'this' here is the existing record/schema of the user
  //first we will check is password being updated or not because it will be running on ever save, so if user is only updating name,address etc
  //in that case we won't hash password again if it has not being changed
  if(!user.isModified("password")) return;
  try {
    //generating hash password

     //1: generating salt (here genSalt(10) means 10 round salt, generates random string)
     const salt=await bcrypt.genSalt(10)// we can also do this: const salt="this is a salt"; but not secure at all
     //console.log("salt:",salt) // $2b$10$UjvORRbdKDQVh3aXB3f6wO

     //2: hashing password
     const hashedPassword=await bcrypt.hash(user.password,salt)

     //3: overrides the plan password with the hashed one
     user.password=hashedPassword

      //means we have done processing now you can save in db/do further tasks
  } catch (err) {
    return console.log("error while hashing password:",err);
  }
});
/*
Simple Rule (remember this):
| Middleware Style   | Use `next`? |
| ------------------ | ----------- |
| `async function()` | ❌ NO        |
| `function(next)`   | ✅ YES       |

*/

const User = mongoose.model("User", userSchema);
module.exports = User;
