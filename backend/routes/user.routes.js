import express from 'express'
import { subtitleController } from '../controllers/user.controller.js';
import protectRoute from '../middleware/protectRoute.js';
const router = express.Router();

router.use('/subtitles' , protectRoute ,  express.raw({ type: 'audio/*', limit: '200mb' }) , subtitleController)

export default router;