const router = require('express').Router();
const {
  createRazorpayOrder, verifyAndSaveOrder,
  getMyOrders, getOrderById, validateCoupon,
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.post('/create-razorpay-order', protect, createRazorpayOrder);
router.post('/verify-payment',        protect, verifyAndSaveOrder);
router.get('/my-orders',              protect, getMyOrders);
router.post('/validate-coupon',       protect, validateCoupon);
router.get('/:id',                    protect, getOrderById);

module.exports = router;