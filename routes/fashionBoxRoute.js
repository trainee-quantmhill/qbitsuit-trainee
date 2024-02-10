
import { Upload} from "../middlewares/update.js";
import { updateFashionBox,updateCases ,uploadFashionBox,uploadCases,deleteFashionBoxCases,getFashionBox,getFashionBoxCases,deleteFashionBox} from "../controllers/fashionBoxController.js";



import express  from "express";
const router = express.Router();


router.post('/upload-fashionbox',uploadFashionBox);
router.patch('/update-fashionbox/:id',updateFashionBox);
router.get('/get-fashionBox/:fashionBoxHeading',getFashionBox);
router.delete('/delete-fashionBox/:fashionBoxHeading',deleteFashionBox);

router.post('/upload-cases',Upload.single('image'),uploadCases);
router.patch('/update-fashionbox-cases/:id',Upload.single('image'),updateCases);
router.get('/get-fashionBox-cases/:heading',getFashionBoxCases);
router.delete('/delete-fashionBox-cases/:heading',deleteFashionBoxCases);
export default router;