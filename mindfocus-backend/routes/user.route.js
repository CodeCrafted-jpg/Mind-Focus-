import express from 'express'
import { logInUser, registerUser } from '../controllers/auth.js'


const userRouter=express.Router()

userRouter.post("/register",registerUser)
userRouter.post("/login",logInUser)





export default userRouter