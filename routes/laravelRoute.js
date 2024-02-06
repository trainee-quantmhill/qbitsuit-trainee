import express from 'express';

//components
import { updateLaravel, uploadLaravel } from '../controllers/laravelController.js';
import { Upload } from '../middlewares/update.js';

//components
const router = express.Router();

router.post('/upload-laravel',Upload.single('image'),uploadLaravel);
router.patch('/update-laravel/:id',Upload.single('image'),updateLaravel);



export default router;