import express from 'express';

//components
import { Upload } from '../middlewares/update.js';
import { updateHrm,updateHrmAccord ,uploadHrm,uploadHrmAccord} from '../controllers/hrm1Controller.js';




const router = express.Router();
router.post('/upload-hrm',Upload.single('image'),uploadHrm);
router.patch('/update-hrm1/:id',Upload.single('image'),updateHrm);


router.post('/upload-hrm-accordian',uploadHrmAccord);
router.patch('/update-hrm-accordian/:id',updateHrmAccord);


export default router;