const mongoose = require("mongoose");
require("dotenv").config();//loading enviroment variables from .env file

//defining the mongodb url connection:
const mongoDbURL = process.env.LOCAL_DB_URL;
// const mongoDbURL=process.env.ONLINE_DB_URL

//these two paramters are passed because otherwise you will get some warning, they make sure that you are working with latest versions
mongoose
  .connect(mongoDbURL, {
    //useNewUrlParser: true,// parses MongoDB connection string (no longer required)
    // useUnifiedTopology: true, // handles server discovery, when using local DB connnection comment this line
  })
  .then(() => console.log("Connected to mongoDB server"))
  .catch((error) => console.log("MongoDB server connection error:", error));

// getting the default mongoose connection instance
const db = mongoose.connection;

db.on('connected',()=>{
    console.log("Connected to mongoDB server")
})


db.on('error',(error)=>{
     console.log("MongoDB server connection error:", error)
})

db.on('disconnected',()=>{
    console.log("Mongodb server is disconnected")
})

// used in server file
module.exports=db