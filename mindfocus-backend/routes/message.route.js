import express from 'express'
import authMiddleware from '../middlewere/Auth.js'
import { deleteMessage, getGroupMessages, sendMessage } from '../controllers/message.js'



const messageRouter=express.Router()

messageRouter.post('/send/:groupId',authMiddleware,sendMessage)
messageRouter.post('/get/:groupId',authMiddleware,getGroupMessages)
messageRouter.delete('/del/:messageId',authMiddleware,deleteMessage)
export default messageRouter