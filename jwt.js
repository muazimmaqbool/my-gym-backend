const jwt=require('jsonwebtoken')
//creating middleware :
//this middle when passed to any route will make sure that whoever route you are accessing needs a token and then verifies the token if token is provided
const jwtAuthMiddleware=(req,res,next)=>{
    //checking if the request header has authorization or not
    const authorization=req.headers.authorization;
    if(!authorization) return res.status(401).json({error:"Token not found!"})
    //extracting token
   const token=req.headers.authorization.split(" ")[1]
    //if token is not passed:
    if(!token){
        res.status(401).json({error:'Unauthorized'})
    }
    //if token is available
    try{
        //verifying the jwt token and it will return decoded payload
        const decodedPayload=jwt.verify(token,process.env.JWT_SECRET_KEY)

        //returning the decoded payload
        req.user=decodedPayload // req.payload=decode or req.user=decoded or req.endcoded etc
        next()
    } catch (error) {
        console.log(`Error in jwtAuthMiddleware: ${error}`)
        res.status(401),json({error:"Invalid Token"})
    }
}

//generating jwt token:
//token needs payload i.e userData that's why it takes parameter as user data or anyname
const generateToken=(payloadData)=>{
    //Token with expiry in 8h i.e 30000/60=500 minutes then 500/60 = 8.33 hours
    return jwt.sign(payloadData,process.env.JWT_SECRET_KEY,{expiresIn:30000})
}
module.exports={jwtAuthMiddleware,generateToken}