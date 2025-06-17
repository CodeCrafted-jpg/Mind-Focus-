import express from 'express'
import { AddBlockSite, getAllBlockSites, removeBlocksite } from '../controllers/blockSites.js'
import authMiddleware from '../middlewere/Auth.js'


const BlockSiteRouter=express.Router()

BlockSiteRouter.post('/add',authMiddleware,AddBlockSite)
BlockSiteRouter.delete('/remove/:siteId',authMiddleware,removeBlocksite)
BlockSiteRouter.get('/get',authMiddleware,getAllBlockSites)


export  default BlockSiteRouter