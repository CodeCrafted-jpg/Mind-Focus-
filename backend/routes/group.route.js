import express from 'express'
import { searchGroups, createGroup, groupFeed, groupStatus, joinGroup, leaveGroup, allGroupsUserisNotaPartOf, myGroups, groupWeeklyStats } from '../controllers/group.js'
import authMiddleware from '../middlewere/Auth.js'


const groupRouter=express.Router()

groupRouter.post('/create',authMiddleware,createGroup)
groupRouter.post('/join/:groupId',authMiddleware,joinGroup)
groupRouter.post('/leave/:groupId',authMiddleware,leaveGroup)
groupRouter.post('/feed/:groupId',authMiddleware,groupFeed)
groupRouter.post('/status/:groupId',authMiddleware,groupStatus)
groupRouter.get('/my-groups',authMiddleware,myGroups)
groupRouter.get('/all-groups',authMiddleware,allGroupsUserisNotaPartOf)
groupRouter.get('/allGroups',authMiddleware,searchGroups)
groupRouter.get('/weekly-stats/:groupId', authMiddleware, groupWeeklyStats)

export default groupRouter