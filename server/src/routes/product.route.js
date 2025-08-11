import { Router } from 'express';
import { 
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getUserProducts,
  getMyProducts
} from '../controllers/product.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

router.route('/').get(getAllProducts);
router.route('/:id').get(getProductById);

router.route('/').post(verifyJWT, upload.array('images', 5), createProduct);
router.route('/:id').put(verifyJWT, upload.array('images', 5), updateProduct);
router.route('/:id').delete(verifyJWT, deleteProduct);

router.route('/user/:userId').get(getUserProducts);
router.route('/my/products').get(verifyJWT, getMyProducts);

export default router;