import express from 'express';
import { uploadDetails,updateBanner } from '../controllers/bannerController.js';


//components
import { Update } from '../middlewares/update.js';

const router = express.Router();


router.post('/uploadDetails',Update.array('image',2),uploadDetails);
router.patch('/update-banner/:id',Update.array('image',2),updateBanner);

export default router;