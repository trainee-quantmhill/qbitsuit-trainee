import express from 'express';



//components
import { Upload } from '../middlewares/update.js';
import { updateHrm2,updateHrm2Accord ,hrm2AccordianUpload,uploadHrm2} from '../controllers/hrm2Controller.js';

const router = express.Router();



router.post('/upload-hrm2',Upload.single('image'),uploadHrm2);
router.patch('/update-hrm2/:id',Upload.single('image'),updateHrm2);


router.post('/upload-hrm2-accordian',hrm2AccordianUpload);
router.patch('/update-hrm2-accordian/:id',updateHrm2Accord);


export default router;