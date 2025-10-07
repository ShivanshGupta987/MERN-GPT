import {Router} from "express";
import {getAllUsers, userSignup, userLogin, userLogout} from "../controllers/user-controllers.js"
import {validate, signupValidator, loginValidator} from "../utils/validators.js"
import { verifyToken, verifyUser } from "../utils/token-manager.js";
const userRoutes = Router();

userRoutes.get("/", getAllUsers);
userRoutes.post("/signup", validate(signupValidator), userSignup);
userRoutes.post("/login", validate(loginValidator), userLogin);
userRoutes.post("/auth-status", verifyToken, verifyUser);
userRoutes.get("/logout", verifyToken, userLogout);

// default export 
export default userRoutes;

// --- named export ---
// we have to use curly braces while importing
// export {userRoutes};