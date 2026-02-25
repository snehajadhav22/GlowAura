const Order   = require('../models/Order');
const Product = require('../models/Product');
const Coupon  = require('../models/Coupon');
const Razorpay = require('razorpay');
const crypto  = require('crypto');

const rzp = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR' } = req.body;
    const order = await rzp.orders.create({
      amount:   Math.round(amount * 100),
      currency,
      receipt: `rcpt_${Date.now()}`,
    });
    res.json({ orderId: order.id, amount: order.amount, currency });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.verifyAndSaveOrder = async (req, res) => {
  try {
    const {
      razorpayOrderId, razorpayPaymentId, razorpaySignature,
      items, shippingAddress, subtotal, deliveryCharge,
      discount, couponCode, totalAmount,
    } = req.body;

    // Verify Razorpay signature
    const body      = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expected  = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body).digest('hex');

    if (expected !== razorpaySignature)
      return res.status(400).json({ message: 'Payment signature verification failed' });

    const order = await Order.create({
      user: req.user._id,
      items, shippingAddress,
      paymentStatus: 'paid',
      orderStatus:   'Confirmed',
      razorpayOrderId, razorpayPaymentId, razorpaySignature,
      subtotal, deliveryCharge, discount, couponCode, totalAmount,
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // Decrement stock
    await Promise.allSettled(
      items.map(item =>
        Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } })
      )
    );

    // Increment coupon usage
    if (couponCode)
      await Coupon.findOneAndUpdate({ code: couponCode.toUpperCase() }, { $inc: { usedCount: 1 } });

    res.json({ message: 'Order placed successfully', orderId: order._id });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'title images brand')
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id })
      .populate('items.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ order });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.validateCoupon = async (req, res) => {
  try {
    const { code, orderValue } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon)                                    return res.status(404).json({ message: 'Coupon not found' });
    if (coupon.expiresAt && coupon.expiresAt < new Date()) return res.status(400).json({ message: 'Coupon has expired' });
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return res.status(400).json({ message: 'Coupon limit reached' });
    if (orderValue < coupon.minOrderValue)          return res.status(400).json({ message: `Minimum order ₹${coupon.minOrderValue} required` });

    let disc = coupon.discountType === 'percentage'
      ? (orderValue * coupon.discountValue) / 100
      : coupon.discountValue;
    if (coupon.maxDiscount) disc = Math.min(disc, coupon.maxDiscount);

    res.json({ valid: true, discountAmount: +disc.toFixed(2), message: `Saved ₹${disc.toFixed(2)}!` });
  } catch (e) { res.status(500).json({ message: e.message }); }
};