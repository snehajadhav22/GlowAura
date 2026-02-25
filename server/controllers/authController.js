const User = require('../models/User');
const jwt  = require('jsonwebtoken');

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'Email already registered' });
    const user  = await User.create({ name, email, password });
    const token = sign(user._id);
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });
    const token = sign(user._id);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.getMe = (req, res) => res.json({ user: req.user });

exports.updateProfile = async (req, res) => {
  try {
    const { name, address } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id, { name, address }, { new: true }
    ).select('-password');
    res.json({ user });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.toggleWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const id   = req.params.productId;
    const idx  = user.wishlist.findIndex(w => w.toString() === id);
    if (idx > -1) user.wishlist.splice(idx, 1);
    else          user.wishlist.push(id);
    await user.save();
    res.json({ wishlist: user.wishlist });
  } catch (e) { res.status(500).json({ message: e.message }); }
};