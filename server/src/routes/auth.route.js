import { Router } from 'express';
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  getCurrentUser, 
  updateUserProfile,
  refreshAccessToken
} from '../controllers/auth.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/refresh-token').post(refreshAccessToken);

router.route('/logout').post(verifyJWT, logoutUser);
router.route('/me').get(verifyJWT, getCurrentUser);
router.route('/profile').put(verifyJWT, upload.single('profileImage'), updateUserProfile);

export default router;