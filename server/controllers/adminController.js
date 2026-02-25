const User    = require('../models/User');
const Product = require('../models/Product');
const Order   = require('../models/Order');

exports.getStats = async (req, res) => {
  try {
    const [totalUsers, totalProducts, totalOrders, revenue, monthly, topProducts, recentOrders] =
      await Promise.all([
        User.countDocuments({ role: 'user' }),
        Product.countDocuments(),
        Order.countDocuments(),
        Order.aggregate([
          { $match: { paymentStatus: 'paid' } },
          { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]),
        Order.aggregate([
          { $match: { paymentStatus: 'paid' } },
          { $group: {
              _id:     { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
              revenue: { $sum: '$totalAmount' },
              orders:  { $sum: 1 },
          }},
          { $sort: { _id: 1 } },
          { $limit: 6 },
        ]),
        Order.aggregate([
          { $unwind: '$items' },
          { $group: { _id: '$items.product', sold: { $sum: '$items.quantity' }, revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } },
          { $sort: { sold: -1 } },
          { $limit: 5 },
          { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
          { $unwind: '$product' },
        ]),
        Order.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(5),
      ]);

    res.json({
      stats: {
        totalUsers, totalProducts, totalOrders,
        totalRevenue: revenue[0]?.total || 0,
      },
      monthly,
      topProducts,
      recentOrders,
    });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const q = status ? { orderStatus: status } : {};
    const orders = await Order.find(q)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit);
    const total = await Order.countDocuments(q);
    res.json({ orders, total, pages: Math.ceil(total / +limit) });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id, { orderStatus: req.body.status }, { new: true }
    ).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ order });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    res.json({ users });
  } catch (e) { res.status(500).json({ message: e.message }); }
};