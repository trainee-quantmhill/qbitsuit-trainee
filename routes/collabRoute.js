

import express from 'express';
const router = express.Router();


//components
import { updateCollabs ,uploadCollabs,getCollab,deleteCollab} from '../controllers/collabsController.js';
import { Upload } from '../middlewares/update.js';




router.post('/upload-collabs',Upload.single('image'),uploadCollabs);
router.patch('/update-collabs/:id',Upload.single('image'),updateCollabs);
router.get('/get-collab/:collabHeading',getCollab);
router.delete('/delete-collab/:collabHeading',deleteCollab);
export default router;