import {Request, Response, NextFunction} from "express"
import User from "../models/User";
import { createGeminiClient } from "../config/gemini-config";
import { json } from "stream/consumers";




export const generateModelResponse = async(
    req : Request, 
    res : Response, 
    next : NextFunction
) => {

    const {message} = req.body;
    try{

        const user = await User.findById(res.locals.jwtData.id);

        if(!user){
            return res.status(401).json({ message:"User not registered or token malfunctioned"});
        }

       
        // creating gemini aiClient
        const aiClient = createGeminiClient();

        // request payload for a single-turn call
        const request = {
            model : process.env.MODEL_NAME, 
            contents : [{parts:[{text : message}]}],
            config: {
                systemInstruction : {parts : [{text : process.env.SYSTEM_INSTRUCTION}]},
            }
        }
        
        
        //  Calling API and waiting for full response
        const response = await aiClient.models.generateContent(request);
        
        // storing the new query message of the user
        const chats = user.chats.push({role: "user", content: message});

        // storing the response of the GEMINI API
        user.chats.push({ role: "assistant", content: response.text });
        await user.save();
        
        return res.status(200).json({chats: user.chats});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Something went wrong ☹️"})
    }
}


export const sendChatsToUser = async(req:Request, res:Response, next:NextFunction)=>{
    try{
        // verifying the user after after token verification
        const user = await User.findById(res.locals.jwtData.id);
        if(!user){
            return res.status(401).send("User not registered or token malfunctioned");
        }
        if(user._id.toString() !== res.locals.jwtData.id){
            return res.status(401).send("Permissions didn't match");
        }
        return res.status(200).json({message:"OK", chats: user.chats});
   }
   catch(err){
    console.log(err)
    return res.status(200).json({message:"ERROR", cause: err.message});
   }

}
export const deleteChats = async(req:Request, res:Response, next:NextFunction)=>{
    try{
        // verifying the user after after token verification
        const user = await User.findById(res.locals.jwtData.id);
        if(!user){
            return res.status(401).send("User not registered or token malfunctioned");
        }
        if(user._id.toString() !== res.locals.jwtData.id){
            return res.status(401).send("Permissions didn't match");
        }
        // @ts-ignore
        user.chats = [];
        await user.save();
        return res.status(200).json({message:"OK"});
   }
   catch(err){
    console.log(err)
    return res.status(200).json({message:"ERROR", cause: err.message});
   }

}
