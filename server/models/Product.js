const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  discount: { type: Number, default: 0, min: 0, max: 100 },
  brand: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ['Lipstick', 'Foundation', 'Eyeshadow', 'Skincare', 'Perfume',
      'Haircare', 'Nailcare', 'Blush', 'Mascara', 'Clothing', 'Accessories',
      'Eyeliner', 'Highlighter', 'Contour'],
  },
  sizes: [String],
  colors: [String],
  stock: { type: Number, default: 0 },
  images: [{ url: String, publicId: String }],
  reviews: [reviewSchema],
  ratings: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  bestseller: { type: Boolean, default: false },
  gender: { type: String, enum: ['Men', 'Women', 'Unisex'], default: 'Unisex' },
  fabric: String,
  countryOfOrigin: { type: String, default: 'India' },
  tags: [String],

  arConfig: {
    region: {
      type: String,
      enum: ['lips', 'face', 'eyes', 'cheeks', 'lashes', 'brows'],
      default: function () {
        const map = {
          Lipstick: 'lips', Foundation: 'face', Blush: 'cheeks',
          Eyeshadow: 'eyes', Eyeliner: 'eyes', Mascara: 'lashes',
          Highlighter: 'cheeks', Contour: 'face',
        };
        return map[this.category] || 'face';
      },
    },
    textureType: {
      type: String,
      enum: ['solid', 'gradient', 'shimmer', 'glitter'],
      default: 'solid',
    },
    intensityDefault: { type: Number, default: 0.55, min: 0, max: 1 },
    blendMode: {
      type: String,
      enum: ['source-over', 'multiply', 'screen', 'overlay', 'soft-light'],
      default: 'source-over',
    },
    shades: [{
      shadeName: { type: String },
      hexColor: { type: String, required: true },
      undertone: { type: String, enum: ['Warm', 'Cool', 'Neutral'], default: 'Neutral' },
      recommendedFor: [{ type: String, enum: ['Fair', 'Light', 'Medium', 'Tan', 'Deep'] }],
      opacity: { type: Number, default: 0.6 },
      finishType: { type: String, enum: ['matte', 'satin', 'glossy', 'shimmer'], default: 'matte' },
    }],
    arEnabled: { type: Boolean, default: true },
  },

  savedLooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SavedLook' }],
}, { timestamps: true });

productSchema.index({ title: 'text', description: 'text', brand: 'text', tags: 'text' });

productSchema.methods.recalcRating = function () {
  if (!this.reviews.length) { this.ratings = 0; this.numReviews = 0; return; }
  this.ratings = this.reviews.reduce((a, r) => a + r.rating, 0) / this.reviews.length;
  this.numReviews = this.reviews.length;
};

productSchema.virtual('salePrice').get(function () {
  return +(this.price * (1 - this.discount / 100)).toFixed(2);
});

module.exports = mongoose.model('Product', productSchema);