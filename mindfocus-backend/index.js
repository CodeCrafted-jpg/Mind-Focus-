import express from "express"
import cors from "cors"
import connectDB from "./config/connectDB.js"
import dotenv from 'dotenv';

//import routes
import userRouter from "./routes/user.route.js";
import StudySessionRouter from "./routes/studySession.routes.js";
import groupRouter from "./routes/group.route.js";
import messageRouter from "./routes/message.route.js";
import BlockSiteRouter from "./routes/blockSites.route.js";
import ChatRouter from "./routes/chatRoute.js";

//app config
const app=express()
dotenv.config();
const port=process.env.PORT||4000


//middlewere
app.use(express.json())
app.use(cors());

//api Endpoints
app.use('/api/user',userRouter)
app.use('/api/session',StudySessionRouter)
app.use('/api/group',groupRouter)
app.use('/api/message',messageRouter)
app.use('/api/blockSites',BlockSiteRouter)
app.use('/api/chat',ChatRouter)
connectDB()


app.listen(port,()=>{
    console.log(`Server is Running at http://localhost:${port}`)
})



