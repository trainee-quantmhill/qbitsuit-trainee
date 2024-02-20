

import express from 'express';
const router = express.Router();


//components
import { updateCollabs ,uploadCollabs,getCollab,deleteCollab,uploadcheckPoints,updatecheckPoints,getcheckPoints} from '../controllers/collabsController.js';
import { Upload } from '../middlewares/update.js';




router.post('/upload-collabs',uploadCollabs);
router.patch('/update-collabs/:id',updateCollabs);
router.get('/get-collab/',getCollab);
router.delete('/delete-collab/:collabHeading',deleteCollab);


router.post('/upload-collabs-checkPoints',Upload.single('image'),uploadcheckPoints);
router.patch('/update-collabs-checkPoints/:id',Upload.single('image'),updatecheckPoints);
router.get('/get-collab-checkPoints/',getcheckPoints);

export default router;