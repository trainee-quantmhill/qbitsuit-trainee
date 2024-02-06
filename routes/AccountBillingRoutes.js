import express from 'express';

//components
import { updateModule, updateAcoount ,updateAccordian,uploadModule, uploadAccount, uploadAcccordian} from '../controllers/accountBillingController.js';
import { Upload } from '../middlewares/update.js';


const router = express.Router();


router.post('/upload-module',uploadModule);
router.patch('/update-module/:id',updateModule);

router.post('/upload-accountbilling-account',Upload.single('image'),uploadAccount);
router.patch('/update-accountbilling-account/:id',Upload.single('image'),updateAcoount);

router.post('/upload-accordian',uploadAcccordian);
router.patch('/update-accountbilling-accordian/:id',updateAccordian);


export default router;