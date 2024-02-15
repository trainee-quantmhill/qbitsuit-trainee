import express from 'express';



//components
import { Upload } from '../middlewares/update.js';
import { updateHrm2,updateHrm2Accord ,deleteHrm2Accordian,getHrm2,deleteHrm2,getHrm2Accordian,hrm2AccordianUpload,uploadHrm2} from '../controllers/hrm2Controller.js';

const router = express.Router();



router.post('/upload-hrm2',Upload.single('image'),uploadHrm2);
router.patch('/update-hrm2/:id',Upload.single('image'),updateHrm2);
router.get('/get-hrm2/',getHrm2);
router.delete('/delete-hrm2/:hrm2Heading',deleteHrm2);



router.post('/upload-hrm2-accordian',hrm2AccordianUpload);
router.patch('/update-hrm2-accordian/:id',updateHrm2Accord);
router.get('/get-hrm2-accordian/',getHrm2Accordian);
router.delete('/delete-hrm2-accordian/:accordian_2Heading',deleteHrm2Accordian);


export default router;