import express from 'express'
import { endSession, startSession, tickFocusTime, todaysSessions, weeklySessions, weeklyTotalDuration } from '../controllers/studySession.js'
import authMiddleware from '../middlewere/Auth.js'



const StudySessionRouter=express.Router()


StudySessionRouter.post('/start',authMiddleware, startSession)
StudySessionRouter.post('/end/:sessionId',authMiddleware,endSession)
StudySessionRouter.get('/today',authMiddleware,todaysSessions)
StudySessionRouter.get('/weekly',authMiddleware,weeklySessions)
StudySessionRouter.get('/duration',authMiddleware, weeklyTotalDuration)
StudySessionRouter.patch('/tick-focus-time/:sessionId', authMiddleware, tickFocusTime);

export default StudySessionRouter



