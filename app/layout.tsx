import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { CartDrawer } from '@/components/checkout/CartDrawer';
import { ProductDetailModal } from '@/components/storefront/ProductDetailModal';
import { FloatingActions } from '@/components/shared/FloatingActions';
import { LoadingScreen } from '@/components/shared/LoadingScreen';

export const metadata: Metadata = {
  title: 'Mesxico Cakes and Nuts | Artisanal Celebration Cakes & Gourmet Packaged Nuts',
  description:
    'Order freshly baked custom celebration cakes with 48h advance notice and premium roasted packaged nuts with next-day delivery in Lagos, Nigeria. Verified online checkout via Flutterwave.',
  keywords: [
    'cakes in Lagos',
    'custom birthday cakes',
    'Nigerian roasted nuts',
    'cashew nuts bulk',
    'chinut snack',
    'artisanal bakery Nigeria',
  ],
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="flex min-h-full flex-col bg-background text-on-background antialiased selection:bg-primary-container selection:text-on-primary-container overflow-x-clip w-full">
        <LoadingScreen />
        <Navbar />
        <main className="flex-1 overflow-x-clip w-full">{children}</main>
        <CartDrawer />
        <ProductDetailModal />
        <FloatingActions />
        <Footer />
      </body>
    </html>
  );
}
