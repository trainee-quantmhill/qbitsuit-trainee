import express from 'express';

//components
import { updateModule, updateAcoount ,updateAccordian,deleteAccordian,deleteAccount,uploadModule, uploadAccount, uploadAcccordian, getModule,getAccount,getAccordian,deleteModule} from '../controllers/accountBillingController.js';
import { Upload } from '../middlewares/update.js';


const router = express.Router();


router.post('/upload-module',uploadModule);
router.patch('/update-module/:id',updateModule);
router.get('/get-module/:moduleHeading',getModule);
router.delete('/delete-module/:moduleHeading', deleteModule);

router.post('/upload-accountbilling-account',Upload.single('image'),uploadAccount);
router.patch('/update-accountbilling-account/:id',Upload.single('image'),updateAcoount);
router.get('/get-account/:accountHeading',getAccount);
router.delete('/delete-account/:accountHeading',deleteAccount);

router.post('/upload-accordian',uploadAcccordian);
router.patch('/update-accountbilling-accordian/:id',updateAccordian);
router.get('/get-accordian/:accordianHeading',getAccordian);
router.delete('/delete-accordian/:accordianHeading',deleteAccordian);


export default router;