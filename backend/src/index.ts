import express from 'express' ;
import {config} from "dotenv";
import { GoogleGenAI } from '@google/genai';
import morgan from "morgan";
import { connectToDatabase } from './db/connection.js';
import appRouter from "./routes/index.js"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express();

config();

// middilewares
app.use(cors({origin:"http://localhost:5173", credentials:true}))
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// remove in production 
app.use(morgan("dev"))

app.use("/api/v1", appRouter);

const PORT = process.env.PORT || 5000;

// connections and listeners
connectToDatabase().then( ()=>{
app.listen(PORT,()=>console.log("Server Open and connected to Database."))
})
.catch((err) => console.log(err))









// const ai = new GoogleGenAI({
//     apiKey : process.env.GEMINI_API_KEY, 
// });
// app.get("/chat", async (req, res, next)=>{
//     const response = await ai.models. generateContent({
//         model: "gemini-2.5-flash", 
//         contents: "Explain me about India in more than 100 words", 
//         config: {
//             thinkingConfig: {
//                 thinkingBudget: 0, // Disables thinking
//             },
//         }
//     });
//     res.send(response.text)
// })

