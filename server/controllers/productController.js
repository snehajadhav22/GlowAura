const Product = require('../models/Product');
const { cloudinary } = require('../middleware/upload');

exports.getProducts = async (req, res) => {
  try {
    const {
      page = 1, limit = 12, sort = 'newest',
      brand, category, minPrice, maxPrice, discount,
      rating, size, gender, search, bestseller, color, featured,
    } = req.query;

    const q = {};
    if (brand) q.brand = { $in: brand.split(',') };
    if (category) q.category = { $in: category.split(',') };
    if (size) q.sizes = { $in: size.split(',') };
    if (gender) q.gender = gender;
    if (color) q.colors = { $in: color.split(',') };
    if (bestseller) q.bestseller = true;
    if (featured) q.featured = true;
    if (discount) q.discount = { $gte: Number(discount) };
    if (rating) q.ratings = { $gte: Number(rating) };
    if (minPrice || maxPrice) {
      q.price = {};
      if (minPrice) q.price.$gte = +minPrice;
      if (maxPrice) q.price.$lte = +maxPrice;
    }
    if (search) q.$text = { $search: search };

    const sortMap = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      'price-asc': { price: 1 },
      'price-desc': { price: -1 },
      rating: { ratings: -1 },
      discount: { discount: -1 },
      popularity: { numReviews: -1 },
    };

    const skip = (Number(page) - 1) * Number(limit);
    const products = await Product.find(q)
      .sort(sortMap[sort] || sortMap.newest)
      .skip(skip)
      .limit(Number(limit));
    const total = await Product.countDocuments(q);

    res.json({ products, pagination: { total, page: +page, pages: Math.ceil(total / +limit) } });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('reviews.user', 'name avatar');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ product });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

const parseField = (val) => {
  if (!val) return [];
  try { return JSON.parse(val); } catch { return val.split(','); }
};

exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, discount, brand, category,
      stock, bestseller, gender, fabric, countryOfOrigin } = req.body;

    const images = (req.files || []).map(f => ({ url: f.path, publicId: f.filename }));

    const product = await Product.create({
      title, description, price: +price, discount: +(discount || 0),
      brand, category, stock: +(stock || 0),
      sizes: parseField(req.body.sizes),
      colors: parseField(req.body.colors),
      tags: parseField(req.body.tags),
      images, bestseller: bestseller === 'true',
      gender, fabric, countryOfOrigin,
    });
    res.status(201).json({ product });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.updateProduct = async (req, res) => {
  try {
    const updates = { ...req.body };
    ['price', 'discount', 'stock'].forEach(k => { if (updates[k]) updates[k] = +updates[k]; });
    ['sizes', 'colors', 'tags'].forEach(k => {
      if (updates[k] && typeof updates[k] === 'string') updates[k] = parseField(updates[k]);
    });
    if (updates.bestseller) updates.bestseller = updates.bestseller === 'true';

    if (req.files?.length) {
      const newImgs = req.files.map(f => ({ url: f.path, publicId: f.filename }));
      updates.$push = { images: { $each: newImgs } };
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ product });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await Promise.allSettled(
      product.images.map(img => cloudinary.uploader.destroy(img.publicId))
    );
    await product.deleteOne();
    res.json({ message: 'Product deleted successfully' });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.reviews.some(r => r.user?.toString() === req.user._id.toString()))
      return res.status(400).json({ message: 'Already reviewed this product' });
    product.reviews.push({ user: req.user._id, name: req.user.name, rating: +rating, comment });
    product.recalcRating();
    await product.save();
    res.status(201).json({ message: 'Review added' });
  } catch (e) { res.status(500).json({ message: e.message }); }
};