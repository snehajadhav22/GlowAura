require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
const Coupon = require('./models/Coupon');

const products = [
  {
    title: 'Matte Velvet Lipstick',
    description: 'Long-lasting matte finish with intense pigmentation.',
    price: 599,
    discount: 20,
    brand: 'Lakme',
    category: 'Lipstick',
    stock: 50,
    bestseller: true,
    ratings: 4.5,
    numReviews: 128,
    colors: ['Red', 'Pink', 'Nude', 'Berry'],
    images: [{ url: 'https://images.unsplash.com/photo-1586495777744-4e6232bf2177?w=400', publicId: 'seed1' }],
    arConfig: {
      region: 'lips',
      textureType: 'solid',
      intensityDefault: 0.6,
      blendMode: 'source-over',
      arEnabled: true,
      shades: [
        { shadeName: 'Classic Red', hexColor: '#CC3344', undertone: 'Neutral', recommendedFor: ['Fair', 'Light', 'Medium'], opacity: 0.65, finishType: 'matte' },
        { shadeName: 'Berry Kiss', hexColor: '#CC5577', undertone: 'Cool', recommendedFor: ['Light', 'Medium'], opacity: 0.6, finishType: 'satin' },
        { shadeName: 'Warm Nude', hexColor: '#CC7766', undertone: 'Warm', recommendedFor: ['Medium', 'Tan'], opacity: 0.55, finishType: 'matte' },
        { shadeName: 'Deep Wine', hexColor: '#882233', undertone: 'Cool', recommendedFor: ['Tan', 'Deep'], opacity: 0.7, finishType: 'matte' },
        { shadeName: 'Peach Coral', hexColor: '#E8967A', undertone: 'Warm', recommendedFor: ['Fair', 'Light'], opacity: 0.5, finishType: 'glossy' },
        { shadeName: 'Rose Velvet', hexColor: '#B85C5C', undertone: 'Neutral', recommendedFor: ['Light', 'Medium', 'Tan'], opacity: 0.6, finishType: 'matte' },
      ],
    },
  },
  {
    title: 'HD Foundation SPF 30',
    description: 'Full coverage foundation for flawless skin.',
    price: 1299,
    discount: 15,
    brand: 'Maybelline',
    category: 'Foundation',
    stock: 35,
    ratings: 4.3,
    numReviews: 89,
    images: [{ url: 'https://images.unsplash.com/photo-1512207650059-21f28c2fdfa9?w=400', publicId: 'seed2' }],
    arConfig: {
      region: 'face',
      intensityDefault: 0.5,
      blendMode: 'multiply',
      arEnabled: true,
      shades: [
        { shadeName: 'Fair Ivory', hexColor: '#F5DEB3', undertone: 'Neutral', recommendedFor: ['Fair'], opacity: 0.4 },
        { shadeName: 'Light Beige', hexColor: '#E8C8A0', undertone: 'Warm', recommendedFor: ['Light'], opacity: 0.45 },
        { shadeName: 'Natural Sand', hexColor: '#D4A873', undertone: 'Neutral', recommendedFor: ['Medium'], opacity: 0.5 },
        { shadeName: 'Caramel', hexColor: '#A88050', undertone: 'Warm', recommendedFor: ['Tan', 'Deep'], opacity: 0.55 },
      ],
    },
  },
  {
    title: 'Rose Gold Eyeshadow Palette',
    description: '12 stunning shades for every look.',
    price: 1899,
    discount: 30,
    brand: 'Huda',
    category: 'Eyeshadow',
    stock: 25,
    bestseller: true,
    ratings: 4.8,
    numReviews: 213,
    images: [{ url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400', publicId: 'seed3' }],
    arConfig: {
      region: 'eyes',
      textureType: 'shimmer',
      intensityDefault: 0.4,
      blendMode: 'screen',
      arEnabled: true,
      shades: [
        { shadeName: 'Golden Glow', hexColor: '#FFD700', finishType: 'shimmer', opacity: 0.5 },
        { shadeName: 'Rose Dust', hexColor: '#B87333', finishType: 'matte', opacity: 0.6 },
        { shadeName: 'Plum Dream', hexColor: '#4B0082', finishType: 'shimmer', opacity: 0.4 },
      ],
    },
  },
  { title: 'Vitamin C Brightening Serum', description: 'Daily serum for glowing, even-toned skin.', price: 799, discount: 10, brand: 'Nykaa', category: 'Skincare', stock: 60, ratings: 4.6, numReviews: 175, images: [{ url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400', publicId: 'seed4' }] },
  { title: 'Floral Eau de Parfum 50ml', description: 'Delicate floral notes with a hint of musk.', price: 2499, discount: 5, brand: 'L\'Oreal', category: 'Perfume', stock: 20, ratings: 4.4, numReviews: 62, images: [{ url: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400', publicId: 'seed5' }] },
  {
    title: 'Volumizing Mascara',
    description: '24hr formula for dramatic lashes.',
    price: 499,
    discount: 25,
    brand: 'MAC',
    category: 'Mascara',
    stock: 80,
    bestseller: true,
    ratings: 4.7,
    numReviews: 304,
    images: [{ url: 'https://images.unsplash.com/photo-1611068661561-81571f3a8aa6?w=400', publicId: 'seed6' }],
    arConfig: {
      region: 'lashes',
      intensityDefault: 0.8,
      arEnabled: true,
      shades: [{ shadeName: 'Jet Black', hexColor: '#000000', opacity: 0.9 }],
    },
  },
  {
    title: 'Matte Blush Duo',
    description: 'Two complementary shades for a natural flush.',
    price: 699,
    discount: 15,
    brand: 'Lakme',
    category: 'Blush',
    stock: 45,
    ratings: 4.2,
    numReviews: 91,
    images: [{ url: 'https://images.unsplash.com/photo-1583241800698-e8ab01830a63?w=400', publicId: 'seed7' }],
    arConfig: {
      region: 'cheeks',
      intensityDefault: 0.35,
      blendMode: 'soft-light',
      arEnabled: true,
      shades: [
        { shadeName: 'Soft Pink', hexColor: '#F5A0A0', undertone: 'Cool', recommendedFor: ['Fair', 'Light'], opacity: 0.4 },
        { shadeName: 'Peach Sun', hexColor: '#E89090', undertone: 'Warm', recommendedFor: ['Medium', 'Tan'], opacity: 0.4 },
      ],
    },
  },
  { title: 'Gel Nail Polish Kit', description: 'Chip-free gel formula, 21-day wear.', price: 399, discount: 40, brand: 'Nykaa', category: 'Nailcare', stock: 100, bestseller: true, ratings: 4.5, numReviews: 256, images: [{ url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400', publicId: 'seed8' }] },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log('✅ Products seeded');

  await User.deleteMany({ email: 'admin@glowaura.com' });
  await User.create({ name: 'Admin', email: 'admin@glowaura.com', password: 'admin123', role: 'admin' });
  console.log('✅ Admin user created: admin@glowaura.com / admin123');

  await Coupon.deleteMany({});
  await Coupon.insertMany([
    { code: 'GLOW20', discountType: 'percentage', discountValue: 20, minOrderValue: 500, maxDiscount: 300 },
    { code: 'FLAT100', discountType: 'fixed', discountValue: 100, minOrderValue: 999 },
    { code: 'NEWUSER', discountType: 'percentage', discountValue: 15, usageLimit: 1 },
  ]);
  console.log('✅ Coupons seeded');

  mongoose.disconnect();
}

seed().catch(console.error);