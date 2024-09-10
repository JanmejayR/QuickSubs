import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
import { getUser } from '../models/user.model.js'
const protectRoute = async (req, res, next) =>{
    try{
      const token = req.headers.authorization?.split(' ')[1] ;
      if(!token){
        return res.status(401).json({error: "Unauthorized - No Token Provided"});
      }
      const decoded = jwt.verify(token , process.env.JWT_SECRET);

      if(!decoded){
        return res.status(401).json({error: "Unauthorized - Invalid Token"});
      }

      const { username } = decoded;
      const userResult = await getUser(username)

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        // Add the user to the request object
        console.log(" user verified !")
        next();

    }catch(error){
        console.log("Error in protectRoute middleware: " , error.message)
        res.status(500).json({error: "Internal server error"});
    }
}

export default protectRoute;