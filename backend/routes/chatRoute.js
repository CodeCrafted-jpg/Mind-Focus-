import express from 'express'
import authMiddleware from '../middlewere/Auth.js'
import { deleteSession, getSessionMessages, getUserSessions, sendMessage } from '../controllers/chat.js'


const ChatRouter=express.Router()





ChatRouter.post('/send',authMiddleware,sendMessage)
ChatRouter.get('/get',authMiddleware,getUserSessions)
ChatRouter.post('/messages/:sessionId',authMiddleware,getSessionMessages)
ChatRouter.delete('/delete/:sessionId',authMiddleware,deleteSession)
export default ChatRouter