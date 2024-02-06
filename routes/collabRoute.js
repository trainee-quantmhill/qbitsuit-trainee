

import express from 'express';
const router = express.Router();


//components
import { updateCollabs ,uploadCollabs} from '../controllers/collabsController.js';
import { Upload } from '../middlewares/update.js';




router.post('/upload-collabs',Upload.single('image'),uploadCollabs);
router.patch('/update-collabs/:id',Upload.single('image'),updateCollabs);

export default router;