import Header from "./components/header/Header";
import Chat from "./pages/Chat";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import {Route, Routes} from "react-router-dom"
import NotFound from "./pages/NotFound";
import { useAuth } from "./context/AuthContext";


function App(){
  const auth = useAuth();
  // console.log(useAuth()?.isLoggedIn)
  return (
    <main> 
      <Header/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>}/>
        /* Protetected route */
        {auth?.isLoggedIn && auth?.user && <Route path="/chat" element={<Chat/>}/> }
        <Route path="*" element={<NotFound/>}/>
      </Routes>
      
    </main>
  );
}
export default App;