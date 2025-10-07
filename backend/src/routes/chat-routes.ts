import {Router} from "express";
import { verifyToken } from "../utils/token-manager";
import { validate, userMessageValidator } from "../utils/validators";
import { deleteChats, generateModelResponse, sendChatsToUser } from "../controllers/chat-controllers";

// Protected API
const chatRoutes = Router();

chatRoutes.post("/new", validate(userMessageValidator), verifyToken, generateModelResponse);
chatRoutes.get("/all-chats", verifyToken, sendChatsToUser);
chatRoutes.delete("/delete", verifyToken, deleteChats);
export default chatRoutes;