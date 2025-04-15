import express from 'express'
import { getLessees } from '../controllers/lesseeController.js'

const router = express.Router()

router.get('/getall', getLessees)

export default router