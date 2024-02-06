
import { Upload} from "../middlewares/update.js";
import { updateFashionBox,updateCases ,uploadFashionBox,uploadCases} from "../controllers/fashionBoxController.js";



import express  from "express";
const router = express.Router();


router.post('/upload-fashionbox',uploadFashionBox);
router.patch('/update-fashionbox/:id',updateFashionBox);

router.post('/upload-cases',Upload.single('image'),uploadCases);
router.patch('/update-fashionbox-cases/:id',Upload.single('image'),updateCases);

export default router;