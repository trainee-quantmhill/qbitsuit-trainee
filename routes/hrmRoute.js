import express from 'express';

//components
import { Upload } from '../middlewares/update.js';
import { updateHrm,updateHrmAccord ,uploadHrm,getHrm1,deleteHrm1Accordian,uploadHrmAccord,getHrm1Accordian,deleteHrm1} from '../controllers/hrm1Controller.js';




const router = express.Router();
router.post('/upload-hrm',Upload.single('image'),uploadHrm);
router.patch('/update-hrm1/:id',Upload.single('image'),updateHrm);
router.get('/get-hrm1/:hrmHeading',getHrm1);
router.delete('/delete-hrm1/:hrmHeading',deleteHrm1);



router.post('/upload-hrm-accordian',uploadHrmAccord);
router.patch('/update-hrm-accordian/:id',updateHrmAccord);
router.get('/get-hrm1-accordian/:accordian_1Heading',getHrm1Accordian);
router.delete('/delete-hrm1-accordian/:accordian_1Heading',deleteHrm1Accordian);


export default router;