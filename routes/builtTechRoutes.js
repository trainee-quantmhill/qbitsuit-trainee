import { updateBuiltTechCards,updateBuiltTech,uploadBuilt,uploadBuiltTechCards} from "../controllers/builtTechController.js";

import { Upload } from "../middlewares/update.js";

import express from 'express';
const router = express.Router();


router.post('/upload-builtTech',uploadBuilt);
router.patch('/update-builtTech/:id',updateBuiltTech);



router.post('/upload-builtTechCards',Upload.single('image'),uploadBuiltTechCards);
router.patch('/update-builtTech-Cards/:id',Upload.single('image'),updateBuiltTechCards);

export default router;