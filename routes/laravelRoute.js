import express from 'express';

//components
import { updateLaravel, uploadLaravel ,getLaravel,deleteLaravel} from '../controllers/laravelController.js';
import { Upload } from '../middlewares/update.js';

//components
const router = express.Router();

router.post('/upload-laravel',Upload.single('image'),uploadLaravel);
router.patch('/update-laravel/:id',Upload.single('image'),updateLaravel);
router.get('/get-laravel/',getLaravel);
router.delete('/delete-laravel/:laravelHeading',deleteLaravel);

export default router;