import { Router } from 'express';
import { 
  createOrder,
  createCartOrder,
  getUserOrders,
  getMyOrders,
  getOrderById,
  returnItem,
  cancelOrder,
  getOrdersForMyProducts
} from '../controllers/order.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyJWT);

router.route('/').post(createOrder);
router.route('/cart').post(createCartOrder);
router.route('/my').get(getMyOrders);
router.route('/my-products').get(getOrdersForMyProducts);
router.route('/user/:userId').get(getUserOrders);
router.route('/:id').get(getOrderById);
router.route('/:id/return').put(returnItem);
router.route('/:id/cancel').put(cancelOrder);

export default router;