import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
dotenv.config();
import { createUser , getUser} from '../models/user.model.js';

import jwt from 'jsonwebtoken'

export const signUpController = async(req,res)=>{
    const {username, password, email } = req.body;
    console.log("inside sign up controller :- " ,username , password, email);
    if (username==='' || password==='' || email===''){
        res.status(401).json({error: "missing or invalid credentials"})
        return
    }


    try{
        const id = await createUser(username,password,email)
        res.status(201).json({message: "Sign up successful" , id})
    }catch(error){
        console.log (" the error :- ", error)
        res.status(500).json({error: error.message })
    }

    
}


export const loginController = async(req,res)=>{
    const {username, password} = req.body;
    const name = username.trim()
    console.log("user creds during login :-" ,  name, password)

    if (name==='' || password==='' ){
        res.status(401).json({error: "missing or invalid credentials"})
        return
    }

    try{

        const result = await getUser(name);

        if(result.rows.length === 0){
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const registeredUser = result.rows[0];
        const registeredUserId = registeredUser.id;
     
        const passwordMatched = await bcrypt.compare(password, registeredUser.password);

        if (!passwordMatched) {
            return res.status(401).json({ error: "wrong username or password" });
        }
      
        // generate jwt if credentials are verified
        const token = jwt.sign({ registeredUserId, username }, process.env.JWT_SECRET, { expiresIn: '2h' });
        res.status(200).json({message: "Login successful" , jwt:token})



    }catch(error){
        console.log("the error :-" , error);
        res.status(500).json({err: "Error in login controller", error })
    }

   
}