import {Request, Response, NextFunction} from "express"
import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "./constants";
import User from "../models/User";


export const createToken = (id: string, email: string) =>{
    const payload = {id, email};
    const token = jwt.sign(
        payload, 
        process.env.JWT_SECRET,  
        { 
            expiresIn : "7d" // token expiry after 7 days
        }
    );
    return token;
};

export const verifyToken = async(req:Request, res:Response, next:NextFunction)=>{
    // signedCookies is an object that stores all different type of cookies
    const token = req.signedCookies[`${COOKIE_NAME}`];
    // console.log(token);
    
    if(!token || token.trim() === ""){
        return res.status(401).json({message: "Token not received"});
    }
    const promise = new Promise<void>((resolve, reject)=>{
        // other than token and secret key, we can pass callback function to execute error 
        // or success specific action
        return jwt.verify(token, process.env.JWT_SECRET, (err, success)=>{
            if(err){
                reject(err.message);
                return res.status(401).json({message:"Token Expired"});
            }
            else{
                console.log("Token Verification Successful");
                resolve();
                res.locals.jwtData = success;
                return next();
            }
        })
    });
    return promise;
}

export const verifyUser = async(req:Request, res:Response, next:NextFunction)=>{
    try{
        // verifying the user after after token verification
        const user = await User.findById(res.locals.jwtData.id);
        if(!user){
            return res.status(401).send("User not registered or token malfunctioned");
        }
        if(user._id.toString() !== res.locals.jwtData.id){
            return res.status(401).send("Permissions didn't match");
        }
        return res.status(200).json({message:"OK", name: user.name, email: user.email});
   }
   catch(err){
    console.log(err)
    return res.status(200).json({message:"ERROR", cause: err.message});
   }
}
