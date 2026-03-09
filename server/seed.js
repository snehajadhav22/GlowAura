require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
const Coupon = require('./models/Coupon');

const products = [

  // ───────────────────────── LIPSTICKS ─────────────────────────

  {
    title: 'Maybelline New York Fit Me Matte + Poreless 16H Oil Control Foundation With SPF 22 PA ++ 128 Warm Nude',
    description: 'Long-lasting matte finish with intense pigmentation. Glides on smoothly and stays put for up to 16 hours without drying out.',
    price: 599, discount: 20, brand: 'Maybelline', category: 'Foundation',
    stock: 50, bestseller: true, featured: true, ratings: 4.5, numReviews: 128,
    colors: ['Red', 'Pink', 'Nude', 'Berry'],
    images: [{ url: 'https://images-static.nykaa.com/media/catalog/product/8/e/8eb092f6902395722434_1.jpg', publicId: 'seed_lip_1' }],
    arConfig: {
      region: 'lips', textureType: 'solid', intensityDefault: 0.6, blendMode: 'source-over', arEnabled: true,
      shades: [
        { shadeName: 'Classic Red', hexColor: '#CC3344', undertone: 'Neutral', recommendedFor: ['Fair', 'Light', 'Medium'], opacity: 0.65, finishType: 'matte' },
        { shadeName: 'Berry Kiss', hexColor: '#CC5577', undertone: 'Cool', recommendedFor: ['Light', 'Medium'], opacity: 0.6, finishType: 'satin' },
        { shadeName: 'Warm Nude', hexColor: '#CC7766', undertone: 'Warm', recommendedFor: ['Medium', 'Tan'], opacity: 0.55, finishType: 'matte' },
        { shadeName: 'Deep Wine', hexColor: '#882233', undertone: 'Cool', recommendedFor: ['Tan', 'Deep'], opacity: 0.7, finishType: 'matte' },
      ],
    },
  },
  {
    title: "M.A.C Powder Kiss Hazy Matte Lipstick - Marrakesh Mere(3.5g)",
    description: 'A weightless matte lipstick infused with powder for a soft, hazy finish. Comfortable 8-hour wear with rich pigmentation.',
    price: 1900, discount: 10, brand: 'MAC', category: 'Lipstick',
    stock: 40, bestseller: true, featured: true, ratings: 4.6, numReviews: 210,
    colors: ['Marrakesh Mere'],
    images: [{ url: 'https://images-static.nykaa.com/media/catalog/product/f/6/f6ea91fMACXX00002867_1.jpg', publicId: 'seed_lip_2' }],
    arConfig: {
      region: 'lips', textureType: 'solid', intensityDefault: 0.65, blendMode: 'source-over', arEnabled: true,
      shades: [
        { shadeName: 'Marrakesh Mere', hexColor: '#A0522D', undertone: 'Warm', recommendedFor: ['Medium', 'Tan', 'Deep'], opacity: 0.7, finishType: 'matte' },
        { shadeName: 'Dusty Rose', hexColor: '#C08080', undertone: 'Neutral', recommendedFor: ['Fair', 'Light'], opacity: 0.6, finishType: 'matte' },
      ],
    },
  },
  {
    title: "L'Oreal Paris Infallible Matte Resistance Liquid Lipstick - 635 Worth It Medium(5g)",
    description: 'Up to 16-hour matte wear with featherweight comfort. Liquid formula glides on effortlessly for a transfer-proof finish.',
    price: 699, discount: 15, brand: "L'Oreal", category: 'Lipstick',
    stock: 60, ratings: 4.4, numReviews: 185,
    colors: ['Worth It Medium'],
    images: [{ url: 'https://images-static.nykaa.com/media/catalog/product/4/7/47e3cf9LOREA00000556z_1.jpg', publicId: 'seed_lip_3' }],
    arConfig: {
      region: 'lips', textureType: 'solid', intensityDefault: 0.7, blendMode: 'source-over', arEnabled: true,
      shades: [
        { shadeName: 'Worth It Medium', hexColor: '#B05050', undertone: 'Neutral', recommendedFor: ['Medium', 'Tan'], opacity: 0.75, finishType: 'matte' },
        { shadeName: 'Fearless', hexColor: '#CC2244', undertone: 'Cool', recommendedFor: ['Fair', 'Light'], opacity: 0.7, finishType: 'matte' },
      ],
    },
  },
  {
    title: 'Maybelline New York Sensational Liquid Matte Lipstick, Weightless Comfort - 11 Made Easy(7ml)',
    description: 'Lightweight liquid matte lipstick that feels like a second skin. Stays on for hours without drying, delivering intense colour.',
    price: 349, discount: 25, brand: 'Maybelline', category: 'Lipstick',
    stock: 75, ratings: 4.3, numReviews: 160,
    colors: ['Made Easy'],
    images: [{ url: 'https://images-static.nykaa.com/media/catalog/product/a/3/a398c606902395739647-newadd_1.jpg', publicId: 'seed_lip_4' }],
    arConfig: {
      region: 'lips', textureType: 'solid', intensityDefault: 0.6, blendMode: 'source-over', arEnabled: true,
      shades: [
        { shadeName: 'Made Easy', hexColor: '#D2605A', undertone: 'Warm', recommendedFor: ['Fair', 'Light', 'Medium'], opacity: 0.65, finishType: 'matte' },
        { shadeName: 'Nude Nuance', hexColor: '#C49080', undertone: 'Warm', recommendedFor: ['Medium', 'Tan'], opacity: 0.6, finishType: 'matte' },
      ],
    },
  },
  {
    title: 'Kay Beauty Hydra Creme Lipstick - Panache(3.6g)',
    description: 'Moisturising creamy lipstick enriched with Vitamin E and Shea Butter. Delivers rich colour with a comfortable hydrating finish.',
    price: 549, discount: 10, brand: 'Kay Beauty', category: 'Lipstick',
    stock: 55, ratings: 4.5, numReviews: 140,
    colors: ['Panache'],
    images: [{ url: 'https://images-static.nykaa.com/media/catalog/product/7/c/7ce8dfdKAYBE00000767_1a.jpg', publicId: 'seed_lip_5' }],
    arConfig: {
      region: 'lips', textureType: 'solid', intensityDefault: 0.6, blendMode: 'source-over', arEnabled: true,
      shades: [
        { shadeName: 'Panache', hexColor: '#B44060', undertone: 'Cool', recommendedFor: ['Fair', 'Light', 'Medium'], opacity: 0.65, finishType: 'satin' },
        { shadeName: 'Grace', hexColor: '#C87090', undertone: 'Neutral', recommendedFor: ['Medium', 'Tan'], opacity: 0.6, finishType: 'satin' },
      ],
    },
  },
  {
    title: 'Maybelline New York Color Sensational Creamy Matte Lipstick, Lasts Up To 12H - 657 Nude Nuance(3.9g)',
    description: 'Iconic creamy matte formula that lasts 12 hours. Enriched with honey nectar for a comfortable matte finish.',
    price: 349, discount: 20, brand: 'Maybelline', category: 'Lipstick',
    stock: 80, bestseller: true, ratings: 4.4, numReviews: 220,
    colors: ['Nude Nuance'],
    images: [{ url: 'https://images-static.nykaa.com/media/catalog/product/a/3/a398c6041554453645-newadd_1.jpg', publicId: 'seed_lip_6' }],
    arConfig: {
      region: 'lips', textureType: 'solid', intensityDefault: 0.6, blendMode: 'source-over', arEnabled: true,
      shades: [
        { shadeName: 'Nude Nuance', hexColor: '#C8947A', undertone: 'Warm', recommendedFor: ['Fair', 'Light', 'Medium'], opacity: 0.6, finishType: 'matte' },
        { shadeName: 'Divine Wine', hexColor: '#7A2035', undertone: 'Cool', recommendedFor: ['Tan', 'Deep'], opacity: 0.7, finishType: 'matte' },
      ],
    },
  },
  {
    title: 'Rom&nd The Juicy Lasting Tint - 09 Mulled Peach(3.5g)',
    description: 'Long-lasting tint with a juicy, weightless feel. Korean formula delivers vivid colour that stays vibrant all day.',
    price: 799, discount: 5, brand: 'Rom&nd', category: 'Lipstick',
    stock: 35, ratings: 4.7, numReviews: 95,
    colors: ['Mulled Peach'],
    images: [{ url: 'https://images-static.nykaa.com/media/catalog/product/d/6/d671f088800258080142_1.jpg', publicId: 'seed_lip_7' }],
    arConfig: {
      region: 'lips', textureType: 'solid', intensityDefault: 0.5, blendMode: 'source-over', arEnabled: true,
      shades: [
        { shadeName: 'Mulled Peach', hexColor: '#E8906A', undertone: 'Warm', recommendedFor: ['Fair', 'Light', 'Medium'], opacity: 0.55, finishType: 'glossy' },
        { shadeName: 'Cherry Flush', hexColor: '#CC4455', undertone: 'Cool', recommendedFor: ['Light', 'Medium'], opacity: 0.5, finishType: 'glossy' },
      ],
    },
  },
  {
    title: 'SUGAR Glide Peptide Serum Lipstick with Vitamin E | 1 Swipe Full Coverage - 02 Positano Peach(4.2g)',
    description: 'Peptide-infused serum lipstick with full-coverage colour in a single swipe. Vitamin E provides nourishment while you wear it.',
    price: 699, discount: 12, brand: 'SUGAR', category: 'Lipstick',
    stock: 50, ratings: 4.5, numReviews: 112,
    colors: ['Positano Peach'],
    images: [{ url: 'http://images-static.nykaa.com/media/catalog/product/d/8/d81b296SUGAR00000961_1a.jpg', publicId: 'seed_lip_8' }],
    arConfig: {
      region: 'lips', textureType: 'solid', intensityDefault: 0.6, blendMode: 'source-over', arEnabled: true,
      shades: [
        { shadeName: 'Positano Peach', hexColor: '#E8805A', undertone: 'Warm', recommendedFor: ['Fair', 'Light', 'Medium'], opacity: 0.6, finishType: 'satin' },
        { shadeName: 'Coral Crush', hexColor: '#E06050', undertone: 'Warm', recommendedFor: ['Medium', 'Tan'], opacity: 0.65, finishType: 'satin' },
      ],
    },
  },
  {
    title: 'Blue Heaven Get Matte Long Lasting Lipstick - 403PM(4g)',
    description: 'Budget-friendly long-lasting matte lipstick with intense colour payoff. Stays put for hours without touch-ups.',
    price: 179, discount: 30, brand: 'Blue Heaven', category: 'Lipstick',
    stock: 100, ratings: 4.1, numReviews: 88,
    colors: ['403PM'],
    images: [{ url: 'https://images-static.nykaa.com/media/catalog/product/c/6/c6b4711BLUEH00000956_1.jpg', publicId: 'seed_lip_9' }],
    arConfig: {
      region: 'lips', textureType: 'solid', intensityDefault: 0.65, blendMode: 'source-over', arEnabled: true,
      shades: [
        { shadeName: '403PM', hexColor: '#AA3344', undertone: 'Cool', recommendedFor: ['Fair', 'Light', 'Medium', 'Tan'], opacity: 0.7, finishType: 'matte' },
        { shadeName: 'Berry Bold', hexColor: '#882255', undertone: 'Cool', recommendedFor: ['Tan', 'Deep'], opacity: 0.7, finishType: 'matte' },
      ],
    },
  },
  {
    title: 'MARS Creamy Matte Lipstick 06-Bhangra Bloom(3.2g)',
    description: 'Richly pigmented creamy matte lipstick with a smooth blendable formula. Comfortable all-day wear with vibrant colour.',
    price: 249, discount: 20, brand: 'MARS', category: 'Lipstick',
    stock: 90, ratings: 4.2, numReviews: 74,
    colors: ['Bhangra Bloom'],
    images: [{ url: 'https://images-static.nykaa.com/media/catalog/product/4/f/4f03aa1MARSX00000481x_1.jpg', publicId: 'seed_lip_10' }],
    arConfig: {
      region: 'lips', textureType: 'solid', intensityDefault: 0.6, blendMode: 'source-over', arEnabled: true,
      shades: [
        { shadeName: 'Bhangra Bloom', hexColor: '#C04060', undertone: 'Neutral', recommendedFor: ['Fair', 'Light', 'Medium', 'Tan'], opacity: 0.65, finishType: 'matte' },
        { shadeName: 'Peachy Keen', hexColor: '#D87060', undertone: 'Warm', recommendedFor: ['Fair', 'Light'], opacity: 0.6, finishType: 'matte' },
      ],
    },
  },

  // ───────────────────────── FOUNDATIONS ─────────────────────────

  {
    title: 'Swiss Beauty Matte Maxx Cover Foundation with Hyaluronic Acid & Vitamin E - 3 Light Warm(30g)',
    description: 'Full-coverage matte foundation enriched with Hyaluronic Acid & Vitamin E for hydrated, flawless skin. Lightweight formula.',
    price: 399, discount: 20, brand: 'Swiss Beauty', category: 'Foundation',
    stock: 55, ratings: 4.3, numReviews: 130,
    images: [{ url: 'https://images-static.nykaa.com/media/catalog/product/0/3/03759188904409747820_1.jpg', publicId: 'seed_fnd_1' }],
    arConfig: {
      region: 'face', intensityDefault: 0.5, blendMode: 'multiply', arEnabled: true,
      shades: [
        { shadeName: 'Light Warm', hexColor: '#EED5B7', undertone: 'Warm', recommendedFor: ['Fair', 'Light'], opacity: 0.4 },
        { shadeName: 'Natural', hexColor: '#D4B896', undertone: 'Neutral', recommendedFor: ['Light', 'Medium'], opacity: 0.45 },
      ],
    },
  },
  {
    title: 'Aflairza Couverture Complete Liquid Foundation - 01 Fair Light(30ml)',
    description: 'High-coverage liquid foundation for a smooth, poreless finish. Buildable formula that evens out skin tone effortlessly.',
    price: 499, discount: 15, brand: 'Aflairza', category: 'Foundation',
    stock: 40, ratings: 4.2, numReviews: 65,
    images: [{ url: 'https://images-static.nykaa.com/media/catalog/product/e/d/edf1ac28908022193224_1.jpg', publicId: 'seed_fnd_2' }],
    arConfig: {
      region: 'face', intensityDefault: 0.45, blendMode: 'multiply', arEnabled: true,
      shades: [
        { shadeName: 'Fair Light', hexColor: '#F5E0C8', undertone: 'Neutral', recommendedFor: ['Fair', 'Light'], opacity: 0.38 },
        { shadeName: 'Light Beige', hexColor: '#E8C8A0', undertone: 'Warm', recommendedFor: ['Light'], opacity: 0.42 },
      ],
    },
  },
  {
    title: 'Lakme Forever Matte Foundation For Superior Coverage, Vitamin E, Lightweight & Water-Resist , Marble(27ml)',
    description: 'Superior coverage matte foundation with Vitamin E. Water-resistant formula delivers a flawless marble-smooth finish.',
    price: 699, discount: 18, brand: 'Lakme', category: 'Foundation',
    stock: 60, bestseller: true, featured: true, ratings: 4.5, numReviews: 195,
    images: [{ url: 'https://images-static.nykaa.com/media/catalog/product/6/9/6920fedLAK_8901030175671_1.jpg', publicId: 'seed_fnd_3' }],
    arConfig: {
      region: 'face', intensityDefault: 0.5, blendMode: 'multiply', arEnabled: true,
      shades: [
        { shadeName: 'Marble', hexColor: '#F0D8C0', undertone: 'Neutral', recommendedFor: ['Fair', 'Light'], opacity: 0.42 },
        { shadeName: 'Ivory', hexColor: '#E8C8A8', undertone: 'Warm', recommendedFor: ['Light', 'Medium'], opacity: 0.45 },
      ],
    },
  },
  {
    title: 'Lakme 9 To 5 Primer + Matte Mini Foundation, SPF 20, For Natural, Flawless Finish - Warm Beige(15ml)',
    description: 'Primer and matte foundation in one! SPF 20 protection with a natural flawless finish that lasts through a 9-to-5 day.',
    price: 399, discount: 10, brand: 'Lakme', category: 'Foundation',
    stock: 70, ratings: 4.4, numReviews: 175,
    images: [{ url: 'https://images-static.nykaa.com/media/catalog/product/8/0/808b92e8901030964565_10.jpg', publicId: 'seed_fnd_4' }],
    arConfig: {
      region: 'face', intensityDefault: 0.45, blendMode: 'multiply', arEnabled: true,
      shades: [
        { shadeName: 'Warm Beige', hexColor: '#D4A878', undertone: 'Warm', recommendedFor: ['Light', 'Medium'], opacity: 0.42 },
        { shadeName: 'Cool Ivory', hexColor: '#ECD8B8', undertone: 'Cool', recommendedFor: ['Fair', 'Light'], opacity: 0.38 },
      ],
    },
  },
  {
    title: 'Lakme 9 To 5 Powerplay Mousse Lightweight Mini Foundation With Long Stay Formula , 01 Rose Ivory(9g)',
    description: 'Ultra-lightweight mousse foundation with long-stay formula. Feels like nothing on skin while giving flawless buildable coverage.',
    price: 299, discount: 10, brand: 'Lakme', category: 'Foundation',
    stock: 65, ratings: 4.3, numReviews: 98,
    images: [{ url: 'https://images-static.nykaa.com/media/catalog/product/0/0/0060d708901030678264-new_1.jpg', publicId: 'seed_fnd_5' }],
    arConfig: {
      region: 'face', intensityDefault: 0.4, blendMode: 'multiply', arEnabled: true,
      shades: [
        { shadeName: 'Rose Ivory', hexColor: '#F0D0C0', undertone: 'Cool', recommendedFor: ['Fair', 'Light'], opacity: 0.36 },
        { shadeName: 'Sand', hexColor: '#D8B890', undertone: 'Warm', recommendedFor: ['Light', 'Medium'], opacity: 0.4 },
      ],
    },
  },
  {
    title: 'Lakme 9 To 5 Powerplay Mousse Lightweight Foundation With Long Stay Formula , Beige Vanila(25g)',
    description: 'Whipped mousse foundation that melts into the skin. Long-stay Beige Vanilla shade suits warm medium skin tones perfectly.',
    price: 699, discount: 15, brand: 'Lakme', category: 'Foundation',
    stock: 55, ratings: 4.4, numReviews: 145,
    images: [{ url: 'https://images-static.nykaa.com/media/catalog/product/0/0/0060d708901030569210-new_1.jpg', publicId: 'seed_fnd_6' }],
    arConfig: {
      region: 'face', intensityDefault: 0.45, blendMode: 'multiply', arEnabled: true,
      shades: [
        { shadeName: 'Beige Vanila', hexColor: '#D4B890', undertone: 'Warm', recommendedFor: ['Light', 'Medium'], opacity: 0.42 },
        { shadeName: 'Golden Beige', hexColor: '#C8A070', undertone: 'Warm', recommendedFor: ['Medium', 'Tan'], opacity: 0.48 },
      ],
    },
  },
  {
    title: 'Lakme 9 To 5 Hya Matte Foundation + Hyaluronic Acid, Hydrated Matte Finish Upto 12Hr Warm Creme(25ml)',
    description: 'First-of-its-kind Hyaluronic Acid-infused matte foundation. Hydrated matte finish that stays for up to 12 hours.',
    price: 799, discount: 15, brand: 'Lakme', category: 'Foundation',
    stock: 50, bestseller: true, featured: true, ratings: 4.6, numReviews: 210,
    images: [{ url: 'https://images-static.nykaa.com/media/catalog/product/1/a/1a32f46LAKME00002115_1.jpg', publicId: 'seed_fnd_7' }],
    arConfig: {
      region: 'face', intensityDefault: 0.48, blendMode: 'multiply', arEnabled: true,
      shades: [
        { shadeName: 'Warm Creme', hexColor: '#DDB890', undertone: 'Warm', recommendedFor: ['Light', 'Medium'], opacity: 0.44 },
        { shadeName: 'Warm Honey', hexColor: '#C8A070', undertone: 'Warm', recommendedFor: ['Medium', 'Tan'], opacity: 0.5 },
      ],
    },
  },
  {
    title: 'Lakme Invisible Finish Full Coverage Liquid Foundation SPF 8 - Shade 01(25ml)',
    description: 'Full coverage liquid foundation with SPF 8. Invisible finish blends seamlessly for a natural, second-skin look.',
    price: 549, discount: 12, brand: 'Lakme', category: 'Foundation',
    stock: 60, ratings: 4.2, numReviews: 120,
    images: [{ url: 'https://images-static.nykaa.com/media/catalog/product/0/a/0a9a514LAK_8901030289354_1.jpg', publicId: 'seed_fnd_8' }],
    arConfig: {
      region: 'face', intensityDefault: 0.45, blendMode: 'multiply', arEnabled: true,
      shades: [
        { shadeName: 'Shade 01', hexColor: '#F0D8B8', undertone: 'Neutral', recommendedFor: ['Fair', 'Light'], opacity: 0.4 },
        { shadeName: 'Shade 02', hexColor: '#DEC0A0', undertone: 'Warm', recommendedFor: ['Light', 'Medium'], opacity: 0.44 },
      ],
    },
  },
  {
    title: 'Guerlain Parure Gold Skin Matte Foundation 02W(35ml)',
    description: 'Luxury matte foundation with skin-care benefits. Guerlain\'s iconic gold-infused formula for a flawless, lasting complexion.',
    price: 7500, discount: 5, brand: 'Guerlain', category: 'Foundation',
    stock: 20, bestseller: true, ratings: 4.8, numReviews: 85,
    images: [{ url: 'https://images-static.nykaa.com/media/catalog/product/d/a/da71d2dGUERL00000602_1.png', publicId: 'seed_fnd_9' }],
    arConfig: {
      region: 'face', intensityDefault: 0.5, blendMode: 'multiply', arEnabled: true,
      shades: [
        { shadeName: '02W', hexColor: '#E5C8A5', undertone: 'Warm', recommendedFor: ['Light', 'Medium'], opacity: 0.45 },
        { shadeName: '01N', hexColor: '#F0D8C0', undertone: 'Neutral', recommendedFor: ['Fair', 'Light'], opacity: 0.4 },
      ],
    },
  },
  {
    title: 'Miss Claire Prestige Stick Foundation - 626C(10gm)',
    description: 'Convenient stick foundation for on-the-go application. Full coverage with a smooth creamy texture that blends like a dream.',
    price: 299, discount: 25, brand: 'Miss Claire', category: 'Foundation',
    stock: 75, ratings: 4.1, numReviews: 92,
    images: [{ url: 'https://images-static.nykaa.com/media/catalog/product/d/4/d4222298903487022485_2.jpg', publicId: 'seed_fnd_10' }],
    arConfig: {
      region: 'face', intensityDefault: 0.5, blendMode: 'multiply', arEnabled: true,
      shades: [
        { shadeName: '626C', hexColor: '#D4A878', undertone: 'Warm', recommendedFor: ['Medium', 'Tan'], opacity: 0.48 },
        { shadeName: 'Fair', hexColor: '#F0D8C0', undertone: 'Neutral', recommendedFor: ['Fair', 'Light'], opacity: 0.4 },
      ],
    },
  },

  // ───────────────────────── EYESHADOWS ─────────────────────────

  {
    title: 'Kay Beauty Discover Eyeshadow Palette Quad - Outshine(4g)',
    description: '4-shade quad palette with blendable, highly pigmented colours. Perfect for creating everyday to dramatic eye looks.',
    price: 599, discount: 15, brand: 'Kay Beauty', category: 'Eyeshadow',
    stock: 45, ratings: 4.5, numReviews: 105,
    images: [{ url: 'https://images-static.nykaa.com/media/catalog/product/7/1/71a7bf4KAYBE00000946_1.jpg', publicId: 'seed_eye_1' }],
    arConfig: {
      region: 'eyes', textureType: 'shimmer', intensityDefault: 0.45, blendMode: 'screen', arEnabled: true,
      shades: [
        { shadeName: 'Champagne Glow', hexColor: '#E8D5A0', finishType: 'shimmer', opacity: 0.5 },
        { shadeName: 'Warm Taupe', hexColor: '#A08060', finishType: 'matte', opacity: 0.6 },
        { shadeName: 'Deep Bronze', hexColor: '#704830', finishType: 'shimmer', opacity: 0.55 },
        { shadeName: 'Smoky Black', hexColor: '#2A2020', finishType: 'matte', opacity: 0.65 },
      ],
    },
  },
  {
    title: 'Swiss Beauty Ultimate 9 Pigmented Colors Eyeshadow Palette - Shade 02(6g)',
    description: '9 ultra-pigmented shades in one palette. Blendable formula with both matte and shimmer finishes for diverse eye artistry.',
    price: 349, discount: 30, brand: 'Swiss Beauty', category: 'Eyeshadow',
    stock: 60, ratings: 4.3, numReviews: 88,
    images: [{ url: 'https://images-static.nykaa.com/media/catalog/product/1/e/1ed1210NYSWISSB00255_x3.jpg', publicId: 'seed_eye_2' }],
    arConfig: {
      region: 'eyes', textureType: 'shimmer', intensityDefault: 0.4, blendMode: 'screen', arEnabled: true,
      shades: [
        { shadeName: 'Ivory Pearl', hexColor: '#F8F0E0', finishType: 'shimmer', opacity: 0.45 },
        { shadeName: 'Blush Pink', hexColor: '#E0A0B0', finishType: 'matte', opacity: 0.55 },
        { shadeName: 'Mauve', hexColor: '#B07080', finishType: 'shimmer', opacity: 0.5 },
        { shadeName: 'Plum', hexColor: '#602040', finishType: 'matte', opacity: 0.65 },
      ],
    },
  },
  {
    title: 'Charlotte Tilbury Luxury Palette - Pillow Talk(5.2gm)',
    description: 'Iconic luxury eyeshadow palette in the beloved Pillow Talk shade family. Wearable, flattering nude-pink tones for every skin tone.',
    price: 5500, discount: 0, brand: 'Charlotte Tilbury', category: 'Eyeshadow',
    stock: 15, bestseller: true, ratings: 4.9, numReviews: 320,
    images: [{ url: 'https://images-static.nykaa.com/media/catalog/product/5/8/58f72865060542721547_1.jpg', publicId: 'seed_eye_3' }],
    arConfig: {
      region: 'eyes', textureType: 'shimmer', intensityDefault: 0.4, blendMode: 'screen', arEnabled: true,
      shades: [
        { shadeName: 'Pillow Talk Light', hexColor: '#F0D0C0', finishType: 'shimmer', opacity: 0.4 },
        { shadeName: 'Pillow Talk Mid', hexColor: '#D0A090', finishType: 'matte', opacity: 0.5 },
        { shadeName: 'Pillow Talk Deep', hexColor: '#A07060', finishType: 'shimmer', opacity: 0.55 },
        { shadeName: 'Pillow Talk Dark', hexColor: '#604040', finishType: 'matte', opacity: 0.65 },
      ],
    },
  },
  {
    title: 'Nykaa Cosmetics Eye Go Pink 9 in 1 Highly Blendable Eyeshadow Palette(9g)',
    description: '9 highly blendable shades in the stunning Eye Go Pink palette. From soft pink mattes to intense glittery finishes.',
    price: 599, discount: 20, brand: 'Nykaa Cosmetics', category: 'Eyeshadow',
    stock: 50, ratings: 4.4, numReviews: 152,
    images: [{ url: 'http://images-static.nykaa.com/media/catalog/product/f/3/f31c72dNYKAC00002810_1.jpg', publicId: 'seed_eye_4' }],
    arConfig: {
      region: 'eyes', textureType: 'shimmer', intensityDefault: 0.45, blendMode: 'screen', arEnabled: true,
      shades: [
        { shadeName: 'Baby Pink', hexColor: '#F0B0C0', finishType: 'matte', opacity: 0.5 },
        { shadeName: 'Rose Gold', hexColor: '#E8A080', finishType: 'shimmer', opacity: 0.55 },
        { shadeName: 'Hot Pink', hexColor: '#D04080', finishType: 'shimmer', opacity: 0.6 },
        { shadeName: 'Deep Fuchsia', hexColor: '#902060', finishType: 'matte', opacity: 0.65 },
      ],
    },
  },
  {
    title: 'Nykaa Eyes On Me! 10-in-1 Eyeshadow Palette - Daydreaming(12g)',
    description: '10 dreamy shades curated for the Daydreaming look. High-pigment formula with smooth blendability for effortless eye artistry.',
    price: 699, discount: 15, brand: 'Nykaa Cosmetics', category: 'Eyeshadow',
    stock: 45, ratings: 4.5, numReviews: 178,
    images: [{ url: 'https://images-static.nykaa.com/media/catalog/product/2/6/262c5ad8904245710590_1.jpg', publicId: 'seed_eye_5' }],
    arConfig: {
      region: 'eyes', textureType: 'shimmer', intensityDefault: 0.42, blendMode: 'screen', arEnabled: true,
      shades: [
        { shadeName: 'Cloud White', hexColor: '#F5F0E8', finishType: 'matte', opacity: 0.4 },
        { shadeName: 'Sky Blue', hexColor: '#90B8D8', finishType: 'shimmer', opacity: 0.45 },
        { shadeName: 'Lilac Dream', hexColor: '#C0A0C8', finishType: 'matte', opacity: 0.55 },
        { shadeName: 'Midnight', hexColor: '#202840', finishType: 'matte', opacity: 0.65 },
      ],
    },
  },
  {
    title: 'Kay Beauty Multi Texture Eyeshadow Palette - Twilight(15g)',
    description: 'Multi-texture palette with 12 shades including mattes, shimmers and glitters. Inspired by the magical twilight sky.',
    price: 999, discount: 10, brand: 'Kay Beauty', category: 'Eyeshadow',
    stock: 35, bestseller: true, ratings: 4.6, numReviews: 198,
    images: [{ url: 'https://images-static.nykaa.com/media/catalog/product/0/b/0b01e5fKAYBE00000721_1.jpg', publicId: 'seed_eye_6' }],
    arConfig: {
      region: 'eyes', textureType: 'shimmer', intensityDefault: 0.45, blendMode: 'screen', arEnabled: true,
      shades: [
        { shadeName: 'Dusk Gold', hexColor: '#D4A040', finishType: 'shimmer', opacity: 0.55 },
        { shadeName: 'Twilight Mauve', hexColor: '#907080', finishType: 'matte', opacity: 0.6 },
        { shadeName: 'Night Sky', hexColor: '#202050', finishType: 'shimmer', opacity: 0.5 },
        { shadeName: 'Cosmos', hexColor: '#400060', finishType: 'shimmer', opacity: 0.65 },
      ],
    },
  },
  {
    title: 'Kay Beauty Eyeshadow Palette - Pure Bloom(10g)',
    description: 'Floral-inspired eyeshadow palette with 8 wearable shades. Soft, romantic tones perfect for everyday and special occasions.',
    price: 799, discount: 10, brand: 'Kay Beauty', category: 'Eyeshadow',
    stock: 40, ratings: 4.5, numReviews: 142,
    images: [{ url: 'https://images-static.nykaa.com/media/catalog/product/4/c/4cc62f78904330901629_1.jpg', publicId: 'seed_eye_7' }],
    arConfig: {
      region: 'eyes', textureType: 'shimmer', intensityDefault: 0.42, blendMode: 'screen', arEnabled: true,
      shades: [
        { shadeName: 'Petal White', hexColor: '#F8E8E0', finishType: 'shimmer', opacity: 0.4 },
        { shadeName: 'Blush Bloom', hexColor: '#E0B0A0', finishType: 'matte', opacity: 0.5 },
        { shadeName: 'Dusty Rose', hexColor: '#C08878', finishType: 'shimmer', opacity: 0.55 },
        { shadeName: 'Berry Blossom', hexColor: '#804060', finishType: 'matte', opacity: 0.65 },
      ],
    },
  },

  // ───────────────────────── OTHER PRODUCTS ─────────────────────────

  {
    title: 'Vitamin C Brightening Serum',
    description: 'Daily serum for glowing, even-toned skin. Packed with 15% Vitamin C and Hyaluronic Acid for radiant complexion.',
    price: 799, discount: 10, brand: 'Nykaa', category: 'Skincare',
    stock: 60, ratings: 4.6, numReviews: 175,
    images: [
      { url: 'https://images.pexels.com/photos/3018845/pexels-photo-3018845.jpeg?auto=compress&cs=tinysrgb&w=600', publicId: 'seed_serum_1' },
    ],
  },
  {
    title: 'Floral Eau de Parfum 50ml',
    description: 'Delicate floral notes with a hint of musk. A captivating fragrance that lasts all day with jasmine and rose top notes.',
    price: 2499, discount: 5, brand: "L'Oreal", category: 'Perfume',
    stock: 20, ratings: 4.4, numReviews: 62,
    images: [
      { url: 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=600', publicId: 'seed_perfume_1' },
    ],
  },
  {
    title: 'Volumizing Mascara',
    description: '24hr waterproof formula for dramatic lashes. Smudge-proof for lashes that wow from morning to night.',
    price: 499, discount: 25, brand: 'MAC', category: 'Mascara',
    stock: 80, bestseller: true, ratings: 4.7, numReviews: 304,
    images: [
      { url: 'https://images.pexels.com/photos/2697787/pexels-photo-2697787.jpeg?auto=compress&cs=tinysrgb&w=600', publicId: 'seed_mascara_1' },
    ],
    arConfig: {
      region: 'lashes', intensityDefault: 0.8, arEnabled: true,
      shades: [{ shadeName: 'Jet Black', hexColor: '#000000', opacity: 0.9 }],
    },
  },
  {
    title: 'Matte Blush Duo',
    description: 'Two complementary shades for a natural flush. Silky powder formula blends effortlessly for a healthy, radiant glow.',
    price: 699, discount: 15, brand: 'Lakme', category: 'Blush',
    stock: 45, ratings: 4.2, numReviews: 91,
    images: [
      { url: 'https://images.pexels.com/photos/2113855/pexels-photo-2113855.jpeg?auto=compress&cs=tinysrgb&w=600', publicId: 'seed_blush_1' },
    ],
    arConfig: {
      region: 'cheeks', intensityDefault: 0.35, blendMode: 'soft-light', arEnabled: true,
      shades: [
        { shadeName: 'Soft Pink', hexColor: '#F5A0A0', undertone: 'Cool', recommendedFor: ['Fair', 'Light'], opacity: 0.4 },
        { shadeName: 'Peach Sun', hexColor: '#E89090', undertone: 'Warm', recommendedFor: ['Medium', 'Tan'], opacity: 0.4 },
      ],
    },
  },
  {
    title: 'Gel Nail Polish Kit',
    description: 'Chip-free gel formula, 21-day wear. Includes 6 trendy shades with UV top coat for salon-quality nails at home.',
    price: 399, discount: 40, brand: 'Nykaa', category: 'Nailcare',
    stock: 100, bestseller: true, ratings: 4.5, numReviews: 256,
    images: [
      { url: 'https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg?auto=compress&cs=tinysrgb&w=600', publicId: 'seed_nails_1' },
    ],
  },
  {
    title: 'Precision Eyeliner Pen',
    description: 'Ultra-precise felt tip eyeliner for sharp wings. Waterproof formula that won\'t smudge.',
    price: 349, discount: 15, brand: 'MAC', category: 'Eyeliner',
    stock: 65, bestseller: true, ratings: 4.6, numReviews: 187,
    images: [
      { url: 'https://images.pexels.com/photos/2661256/pexels-photo-2661256.jpeg?auto=compress&cs=tinysrgb&w=600', publicId: 'seed_eyeliner_1' },
    ],
    arConfig: {
      region: 'eyes', textureType: 'solid', intensityDefault: 0.7, blendMode: 'source-over', arEnabled: true,
      shades: [
        { shadeName: 'Jet Black', hexColor: '#000000', opacity: 0.9, finishType: 'matte' },
      ],
    },
  },
  {
    title: 'Luxury Makeup Brush Set',
    description: 'Professional 12-piece brush set with soft synthetic bristles. Includes face, eye, and lip brushes in a chic pink pouch.',
    price: 1499, discount: 25, brand: 'Huda', category: 'Accessories',
    stock: 30, ratings: 4.7, numReviews: 92,
    images: [
      { url: 'https://images-static.nykaa.com/media/catalog/product/2/2/22233d84186962434891s_2.jpg', publicId: 'seed_brushes_1' },
    ],
  },
];

async function seed() {
  console.log('\n🌱 Starting GlowAura Database Seed...\n');

  try {
    console.log('⏳ Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ Connected to MongoDB (${mongoose.connection.db?.databaseName || 'glowaura'})\n`);
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    console.error('   Check your MONGODB_URI in .env file');
    process.exit(1);
  }

  // Seed Products
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`✅ ${products.length} Products seeded`);

  // Seed Admin User
  await User.deleteMany({ email: 'admin@glowaura.com' });
  await User.create({ name: 'Admin', email: 'admin@glowaura.com', password: 'admin123', role: 'admin' });
  console.log('✅ Admin user created: admin@glowaura.com / admin123');

  // Seed Coupons
  await Coupon.deleteMany({});
  await Coupon.insertMany([
    { code: 'GLOW20', discountType: 'percentage', discountValue: 20, minOrderValue: 500, maxDiscount: 300 },
    { code: 'FLAT100', discountType: 'fixed', discountValue: 100, minOrderValue: 999 },
    { code: 'NEWUSER', discountType: 'percentage', discountValue: 15, usageLimit: 1 },
  ]);
  console.log('✅ Coupons seeded');

  console.log('\n🎉 Seed complete! All data loaded successfully.\n');
  mongoose.disconnect();
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});