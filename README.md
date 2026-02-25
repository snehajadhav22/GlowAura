# GlowAura ✨ - Luxury Aesthetic Beauty & AR Studio

GlowAura is a modern, high-aesthetic beauty marketplace designed for Gen-Z. It combines a premium shopping experience with AI-powered Virtual Try-On (AR) technology, allowing users to test makeup in real-time.

![Aesthetic Vibe](https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600)

## ✨ Features

- **Virtual AR Studio**: Real-time makeup try-on using MediaPipe AI.
- **Smart Shade Matching**: Automatically detects skin tone and recommends the best shades.
- **Micro-Interactions**: Smooth animations, floating sparkles, and premium glassmorphism.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop.
- **Light & Dark Mode**: Respects system preferences while maintaining the brand's aesthetic.
- **Mood-Based Categories**: Shop by vibe (e.g., "Main Character Energy", "Soft Flush").

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS 4.
- **Backend**: Node.js, Express, MongoDB.
- **AI/AR**: MediaPipe (@mediapipe/tasks-vision), WebGL.
- **Icons**: Lucide React.
- **Animations**: Framer Motion & CSS Keyframes.

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/your-repo/glowaura.git
cd glowaura
```

### 2. Setup Backend
```bash
cd server
npm install
npm run seed  # Seed initial products
npm run dev
```

### 3. Setup Frontend
```bash
cd ..
npm install
npm run dev
```

## 💅 Styling Guide

GlowAura uses a custom design system built with Tailwind CSS:
- **Primary**: Soft Pink (`#FF4FA3`)
- **Secondary**: Lavender Purple (`#9b5de5`)
- **Typography**: Playfair Display (Headings) & Poppins (Body)

## 📱 Mobile First

The entire app is built with a mobile-first approach. The AR Studio features optimized camera handling and touch-friendly controls.

## 📄 License

MIT License. Made with 💖 for besties.
