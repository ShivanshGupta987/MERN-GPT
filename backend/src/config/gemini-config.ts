import { GoogleGenAI } from "@google/genai";


export const createGeminiClient = ()=>{
    const GEMINI_API_KEY : string = process.env.GEMINI_API_KEY
    if(!GEMINI_API_KEY){
        throw new Error('GEMINI_API_KEY environment variable is not set')
    }
    const aiClient = new GoogleGenAI({apiKey : GEMINI_API_KEY});
    return aiClient;
}