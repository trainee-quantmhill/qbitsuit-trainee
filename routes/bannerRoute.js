import express from 'express';
import { uploadDetails,updateBanner,getBanner,deleteBanner } from '../controllers/bannerController.js';


//components
import { Update } from '../middlewares/update.js';

const router = express.Router();



router.post('/uploadDetails',Update.array('image',2),uploadDetails);
router.patch('/update-banner/:id',Update.array('image',2),updateBanner);
router.get('/get-banner/:bannerHeading',getBanner);
router.delete('/delete-banner/:bannerHeading',deleteBanner);
export default router;