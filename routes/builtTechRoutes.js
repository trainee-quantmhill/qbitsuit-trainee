import { updateBuiltTechCards,updateBuiltTech,deleteBuiltTech,deleteBuiltTechCards,uploadBuiltTech,uploadBuiltTechCards,getBuiltTech,getBuiltTechCards} from "../controllers/builtTechController.js";

import { Upload } from "../middlewares/update.js";

import express from 'express';
const router = express.Router();


router.post('/upload-builtTech',uploadBuiltTech);
router.patch('/update-builtTech/:id',updateBuiltTech);
router.get('/get-builtech/',getBuiltTech);
router.delete('/delete-builtech/:builtHeading',deleteBuiltTech);

router.post('/upload-builtTechCards',Upload.single('image'),uploadBuiltTechCards);
router.patch('/update-builtTech-Cards/:id',Upload.single('image'),updateBuiltTechCards);
router.get('/get-builtTechCards/',getBuiltTechCards);
router.delete('/delete-builtechCards/:cardheading',deleteBuiltTechCards);
export default router;