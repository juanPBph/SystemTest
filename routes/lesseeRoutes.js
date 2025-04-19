import express from 'express'
import { getLesseeById, getLessees } from '../controllers/lesseeController.js'

const router = express.Router()

router.get('/getall', getLessees)
router.get('/get/:id', getLesseeById)

export default router