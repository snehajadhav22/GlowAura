import './globals.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: { default: 'GlowAura — Luxury Beauty & Fashion', template: '%s | GlowAura' },
  description: 'Shop luxury beauty and fashion with AR try-on. Free delivery on orders above ₹1500.',
  keywords: ['beauty', 'fashion', 'makeup', 'lipstick', 'skincare', 'GlowAura'],
  openGraph: { title: 'GlowAura', description: 'Luxury Beauty & Fashion Platform', type: 'website' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="min-h-screen pt-32 md:pt-36">{children}</main>
            <Footer />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: { borderRadius: '12px', fontFamily: 'Inter, sans-serif', fontSize: '14px' },
                success: { iconTheme: { primary: '#db2777', secondary: '#fff' } },
              }}
            />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}