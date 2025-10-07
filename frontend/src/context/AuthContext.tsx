import { createContext, type ReactNode } from "react";
import {useState, useEffect, useContext} from "react"
import {checkAuthStatus, loginUser, logoutUser, signupUser} from "../helper/api-communicator";

type User = {
    name : string;
    email : string; 
}

type UserAuth = {
    isLoggedIn : boolean;
    user : User | null;
    login: (email: string, password: string)=>Promise<void>;
    signup: (name: string, email: string, password: string)=>Promise<void>;
    logout: () => Promise<void>;
}
const AuthContext = createContext<UserAuth | null>(null);
const AuthProvider = ({children} : {children : ReactNode})=>{
    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(()=>{
        // if user's cookie is valid then skip login
        const checkStatus = async()=>{
            const data = await checkAuthStatus();
            if(data){
                setUser({email: data.email, name: data.name});
                setIsLoggedIn(true);
            }
        }
        checkStatus();

    },[])

    
    const login = async(email: string, password: string) =>{
        const data = await loginUser(email, password);
        if(data){
            setUser({email : data.email, name : data.name});
            setIsLoggedIn(true);
        }
    }
    const signup = async(name: string, email: string, password: string) =>{
        const data = await signupUser(name, email, password);
        if(data){
            setUser({email : data.email, name : data.name});
            setIsLoggedIn(true);
        }
    }
    const logout = async()=>{
        await logoutUser();
        setIsLoggedIn(false);
        setUser(null);
        window.location.reload();
    }

    const value = {
        user,
        isLoggedIn,
        login,
        logout, 
        signup,
    };

    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>

}

const useAuth = () => useContext(AuthContext);
export {AuthContext, AuthProvider, useAuth};
