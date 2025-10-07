import React, { useEffect, useLayoutEffect } from 'react'
import { Box, Avatar, Typography, Button, IconButton } from '@mui/material';
import {red} from "@mui/material/colors";
import {useAuth} from "../context/AuthContext";
import ChatItem from '../components/chat/chatItem';
import {IoMdSend} from "react-icons/io"
import { useRef, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserChats, sendChatRequest, deleteUserChats } from '../helper/api-communicator';
import toast from 'react-hot-toast';

type chatMessage = {
  role: "user" | "assistant";
  content: string;
};

// // Create an array of Chat objects with sample data.
// const chatMessages: chatMessage[] = [
//   {
//     role: "user",
//     content: "What are ES Modules?",
//   },
//   {
//     role: "assistant",
//     content: "ES Modules are the official standard for JavaScript modules. They use `import` and `export` statements to organize and reuse code.",
//   },
//   {
//     role: "user",
//     content: "How do I fix a Vite server error?",
//   },
//   {
//     role: "assistant",
//     content: "Common fixes include updating your Node.js version, reinstalling dependencies, or checking for a port conflict.",
//   },
// ];

const Chat = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [chatMessages, setChatMessages] = useState<chatMessage[]>([]);
  const handleSubmit = async()=>{
    // console.log(inputRef.current?.value);
    // to get the latest input message 
    const content = inputRef.current?.value as string;
    if(inputRef && inputRef.current){
      inputRef.current.value = "";
    }
    const newMessage : chatMessage = {role:"user", content};
    setChatMessages((prev)=>[...prev, newMessage]);
    const chatData = await sendChatRequest(content);
    setChatMessages([...chatData.chats]);
  };
  const handleDeleteChats = async()=>{
    try{
      toast.loading("Deleting Chats", {id:"deletechats"});
      await deleteUserChats();
      setChatMessages([]);
      toast.success("Deleted Chats Successfully", {id:"deletechats"});
    }
    catch(err){
      console.log(err);
      toast.error("Chats Deletion Failed", {id:"deletechats"});
    }
  }
  useLayoutEffect(()=>{
    if(auth?.isLoggedIn && auth.user){
      toast.loading("Loading Chats", {id:"loadchats"});
      getUserChats().then((data)=>{
        setChatMessages([...data.chats]);
        toast.success("Successfully loaded chats", {id: "loadchats"});
      }).catch(err=>{
        console.log(err);
        toast.error("Loading Failed", {id:"loadchats"});
      })
    }
  }, [auth]);

  useEffect(()=>{
    if(!auth?.user){
      navigate("/login");
    }
  },[auth]);
  
  return (
    <Box 
      sx = {{
        display: "flex",
        height: "100%",
        width: "100%",
        maxWidth: "100%",
        flex: 1, 
        mt: 3,
        gap: 3,
      }}
    >
      <Box sx={{
            display: {md: "flex", xs: "none", sm:"none"}, 
            flex : 0.2, 
            flexDirection: "column"
          }}
      >
        <Box sx={{
          display: "flex",
          width: "100%",
          height: "60vh",
          bgcolor: "rgb(17, 29, 39)",
          borderRadius: 5,
          flexDirection: "column",
          mx: 3, 
        }}>
          <Avatar 
            sx = {{
              mx: "auto",
              my: 2,
              bgcolor: "white",
              color: "black",
              fontWeight: 700,
            }}
          >
            {auth?.user?.name[0]}
            {auth?.user?.name.split(" ")[1][0]}
          </Avatar>
          <Typography 
            sx = {{
              mx: "auto",
              // fontFamily: "work sans"
            }}
          >
            You are talking to a chatbot
          </Typography>
          <Typography 
            sx = {{
              mx: "auto",
              // fontFamily: "work sans",
              my: 4, 
              p: 3
            }}
          >
            You can ask some questions related to Knowledge, Business, Advices, Education, etc. But Avoid Sharing Any Personal Information 
          </Typography>
          <Button 
            onClick={handleDeleteChats}
            sx={{
              width: "200px",
              my: "auto",
              color: "white",
              fontWeight: "700",
              borderRadius: 3,
              mx: "auto",
              bgcolor: red[300],
              ":hover":{
                bgcolor: red.A400,
              }
            }}>
            Clear Conversation
          </Button>
        </Box>
      </Box>
      <Box sx={{
        display: "flex", flex:{md:0.8, xs:1, sm:1}, flexDirection:"column", px:3
        }}>
        <Typography sx={{ 
          textAlign: "center",
          fontSize: "40px", 
          color: "white", 
          mx:"auto", 
          fontWeight: "600",
          mb: 2}}>
          Model - Gemini PRO
        </Typography>
        <Box sx={{
          width: "100%",
          height: "60vh",
          borderRadius: 3,
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          overflow: "scroll",
          overflowX: "hidden",
          overflowY: 'auto',
          scrollBehavior: "smooth"
        }}>
          {chatMessages.map((chat, index)=>(
            <ChatItem content = {chat.content} role={chat.role} key={index} />
          ))}
        </Box>
        <div style={{
          width:"100%", 
          borderRadius:8, 
          backgroundColor: "rgb(17,27,39)", 
          display:"flex", 
          margin:"auto",
          position:"sticky",
          borderTop: "1px solid #d72f2fff",
          borderLeft:"1px solid #3719d1ff",
          borderRight: "1px solid #3719d1ff",
          borderBottom: "1px solid #3ac86cff",
           }} >
          {""}
          <input ref={inputRef}  
                type="text" 
                style={{ 
                  width: "100%", 
                  backgroundColor: "transparent", 
                  padding: "30px", 
                  border:"none", 
                  outline:"none", 
                  color: "white", 
                  fontSize: "20px" }}/>
          <IconButton onClick={handleSubmit} 
                      sx={{mx:"1", color:"white"}}>
                  <IoMdSend/> 
          </IconButton>
        </div>
      </Box>
    </Box>
  )
}
export default Chat;