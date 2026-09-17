import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Clock,
  ShieldCheck,
  Heart,
  ArrowRight,
  Cake,
  Nut,
  ShoppingBag,
  Ribbon,
  Star,
  CheckCircle2,
  Users,
  Truck,
  Gift,
} from 'lucide-react';

import { getProducts } from '@/lib/products';
import { formatNaira } from '@/lib/utils';
import { ProductCard } from '@/components/storefront/ProductCard';
import { SpecialityCard } from '@/components/storefront/SpecialityCard';
import { BrushStrokeDivider } from '@/components/shared/BrushStrokeDivider';
import { DarkTexturePattern } from '@/components/shared/DarkTexturePattern';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { HeroCarousel } from '@/components/storefront/HeroCarousel';
import { CatalogSection } from '@/components/storefront/CatalogSection';
import { ContactSection } from '@/components/storefront/ContactSection';

export const revalidate = 60;

export default async function HomePage() {
  const allProducts = await getProducts();

  const cakeProducts = allProducts.filter((p) => p.category === 'cakes');
  const nutProducts = allProducts.filter((p) => p.category === 'nuts');

  // Four featured speciality items with exact requested names, prices, and images from product_images
  const specialityItems = [
    {
      product: allProducts.find((p) => p.slug === 'artisanal-salted-groundnuts-500g') || allProducts[0],
      name: 'Mesxico Groundnuts (75cl)',
      priceDisplay: '₦3,000',
      image: '/product_images/groundnut_display.png',
    },
    {
      product: allProducts.find((p) => p.slug === 'deluxe-swirled-cupcake-box-12') || allProducts[1],
      name: 'Mesxico Cupcakes (box of 12)',
      priceDisplay: '₦18,000 - ₦30,000',
      image: '/product_images/cupcake_candle.jpeg',
    },
    {
      product: allProducts.find((p) => p.slug === 'mesxico-peanut-burger-75cl') || allProducts[2],
      name: 'Mesxico Peanut Burger (75cl)',
      priceDisplay: '₦2,500',
      image: '/product_images/peanut_display.png',
    },
    {
      product: allProducts.find((p) => p.slug === 'velvety-artisanal-chocolate-nut-spread-350g') || allProducts[3],
      name: 'Nutty Chocolate Spread',
      priceDisplay: '₦2,800',
      image: '/product_images/chocolatespread_single.png',
      imageWrapperClassName: 'translate-x-[8.5%] scale-[1.12]',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background w-full overflow-x-clip">
      {/* =========================================================================
          1. HERO SECTION — Dark dramatic backdrop with subtle food-icon texture
          ========================================================================= */}
      <section
        id="hero"
        className="relative min-h-[calc(100vh-80px)] flex flex-col justify-center overflow-hidden bg-background pt-8 pb-20 sm:pb-24 lg:pb-28 scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 w-full my-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">

              <h1 className="font-display font-medium text-4xl sm:text-5xl lg:text-6xl text-on-background tracking-tight leading-[1.15]">
                Good treats are meant to be{' '}
                <span className="text-primary">enjoyed.</span>
              </h1>

              <p className="text-base text-on-surface-variant font-body max-w-md mx-auto lg:mx-0 leading-relaxed">
                Mesxico brings you delicious treats and satisfying snacks made for everyday cravings, special moments, and everything in between.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <a
                  href="#catalog"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-primary text-on-primary hover:bg-on-primary-container active:scale-[0.98] font-body font-semibold px-7 py-3.5 rounded-full text-base min-h-[48px] shadow-sm transition-colors duration-200"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Order now</span>
                </a>

                <a
                  href="#catalog"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 border border-primary text-primary hover:border-on-primary-container hover:text-on-primary-container active:scale-[0.98] font-body font-normal px-6 py-3.5 rounded-full text-base min-h-[48px] transition-colors duration-200"
                >
                  <span>Explore Our Catalog</span>
                </a>
              </div>

              {/* Trust Value Badges */}
              <div className="!mt-6 pt-0 max-w-lg mx-auto lg:mx-0 grid grid-cols-1 sm:grid-cols-[1fr_1fr_1.35fr] gap-2.5 sm:gap-3">
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center text-primary mb-1.5 sm:mb-2">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h4 className="font-semibold text-xs sm:text-sm font-body text-on-surface leading-snug whitespace-nowrap">
                    Made Fresh Daily
                  </h4>
                  <p className="text-[10px] sm:text-xs text-on-surface-variant font-body mt-0.5 leading-relaxed">
                    Locked-in flavor and ultimate crunch.
                  </p>
                </div>

                <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-secondary/15 flex-shrink-0 flex items-center justify-center text-secondary mb-1.5 sm:mb-2">
                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h4 className="font-semibold text-xs sm:text-sm font-body text-on-surface leading-snug whitespace-nowrap">
                    Safely Packaged
                  </h4>
                  <p className="text-[10px] sm:text-xs text-on-surface-variant font-body mt-0.5 leading-relaxed">
                    Hygienically sealed for your peace of mind.
                  </p>
                </div>

                <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center text-primary mb-1.5 sm:mb-2">
                    <Ribbon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h4 className="font-semibold text-xs sm:text-sm font-body text-on-surface leading-snug whitespace-nowrap">
                    Premium Ingredients
                  </h4>
                  <p className="text-[10px] sm:text-xs text-on-surface-variant font-body mt-0.5 leading-relaxed">
                    High-quality ingredients for a rich{' '}
                    <br className="hidden sm:inline" />
                    and yummy taste in every bite.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Hero — Carousel with overlapping image + integrated botanical leaf sprigs */}
            <div className="lg:col-span-5 relative">
              {/* The overlapping hero food image — extends below into features section */}
              <div className="relative z-10 mb-[-10px] lg:mb-[-15px]">
                <HeroCarousel />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DIVIDER 1: Hero (dark) → Features (brand primary) ===== */}
      <BrushStrokeDivider variant="hero-to-features" />

      {/* =========================================================================
          2. VALUE PROPOSITION / FEATURES BAND — Surface-variant background
          ========================================================================= */}
      <section
        style={{ backgroundColor: 'var(--color-surface-variant)' }}
        className="pt-7 pb-8 sm:pb-10 relative"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
            <ScrollReveal staggerIndex={0}>
              <div className="flex flex-col items-center space-y-2.5">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary shadow-xs">
                  <Gift className="w-7 h-7 sm:w-8 sm:h-8 text-primary" strokeWidth={2} />
                </div>
                <h3 className="font-display font-medium text-lg sm:text-xl text-on-surface tracking-tight uppercase">
                  Perfect for Any Occasion
                </h3>
                <p className="text-sm text-on-surface-variant font-body max-w-[275px] mx-auto leading-relaxed">
                  Whether you are stocking up for daily snacking or special celebrations, we have the right treats for the moment.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal staggerIndex={1}>
              <div className="flex flex-col items-center space-y-2.5">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-secondary/15 flex items-center justify-center border-2 border-secondary shadow-xs">
                  <Truck className="w-7 h-7 sm:w-8 sm:h-8 text-secondary" strokeWidth={2} />
                </div>
                <h3 className="font-display font-medium text-lg sm:text-xl text-on-surface tracking-tight uppercase">
                  Ready When You Are
                </h3>
                <p className="text-sm text-on-surface-variant font-body max-w-[275px] mx-auto leading-relaxed">
                  Prepared fresh and packaged safely to ensure your favorite snacks arrive in perfect condition.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal staggerIndex={2}>
              <div className="flex flex-col items-center space-y-2.5">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary shadow-xs">
                  <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-primary" strokeWidth={2} />
                </div>
                <h3 className="font-display font-medium text-lg sm:text-xl text-on-surface tracking-tight uppercase">
                  Satisfied Cravings
                </h3>
                <p className="text-sm text-on-surface-variant font-body max-w-[275px] mx-auto leading-relaxed">
                  Carefully prepared to ensure every order delivers the exact rich, satisfying taste you expect.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===== DIVIDER 2: Features (surface-variant) → Speciality (surface) ===== */}
      <BrushStrokeDivider variant="features-to-content" />

      {/* =========================================================================
          3. SPECIALITY SECTION — White/light background, circular food images
          ========================================================================= */}
      <section className="pt-10 pb-10 sm:pt-14 sm:pb-14 bg-surface relative scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          {/* Script tagline + Bold heading */}
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
              <span className="font-display italic text-base sm:text-lg text-primary">
                Fresh From Mesxico
              </span>
              <h2 className="font-display font-medium text-2xl sm:text-3xl text-on-surface mt-1.5 uppercase tracking-tight">
                Our Speciality
              </h2>
            </div>
          </ScrollReveal>

          {/* Four circular food images — exactly 62px distance between adjacent frames on desktop */}
          <div className="mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-[62px] w-fit justify-center mb-12">
            {specialityItems.map(({ product, name, priceDisplay, image, imageWrapperClassName }, index) => (
              <ScrollReveal key={product.id || index} staggerIndex={index}>
                <SpecialityCard
                  product={product}
                  name={name}
                  priceDisplay={priceDisplay}
                  image={image}
                  imageWrapperClassName={imageWrapperClassName}
                />
              </ScrollReveal>
            ))}
          </div>

          {/* Dual CTA buttons — strictly centralized */}
          <ScrollReveal className="w-full flex justify-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto mx-auto text-center">
              <a
                href="#catalog"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-on-background text-white hover:scale-105 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] font-body font-semibold px-8 py-3.5 rounded-full text-sm min-h-[48px] shadow-sm transition-all duration-200 border border-on-background"
              >
                <Cake className="w-4 h-4" />
                <span>View Full Catalog</span>
              </a>
              <a
                href="#catalog"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-primary text-on-primary hover:scale-105 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] font-body font-semibold px-8 py-3.5 rounded-full text-sm min-h-[48px] shadow-sm transition-all duration-200"
              >
                <ArrowRight className="w-4 h-4" />
                <span>Order Now</span>
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== DIVIDER: Speciality (surface) → Catalog (surface-variant) ===== */}
      <BrushStrokeDivider variant="content-to-variant" />

      {/* =========================================================================
          4. FULL ARTISANAL CATALOG
          ========================================================================= */}
      <CatalogSection products={allProducts} />

      {/* ===== DIVIDER: Catalog (surface-variant) → About Us (surface) ===== */}
      <BrushStrokeDivider variant="variant-to-content" />

      {/* =========================================================================
          5. ABOUT US SECTION
          ========================================================================= */}
      <section id="about" className="py-10 sm:py-14 bg-surface scroll-mt-20 relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-center">
            {/* Visual Photo Collage */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <ScrollReveal staggerIndex={0}>
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-lg border border-outline-variant group">
                  <Image
                    src="/product_images/staffwithproduct.png"
                    alt="Mesxico Baking Team"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </ScrollReveal>

              <ScrollReveal staggerIndex={1}>
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-lg border border-outline-variant mt-8 group">
                  <Image
                    src="/product_images/founderwithproduct.png"
                    alt="Mesxico Founder & Gourmet Treats"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </ScrollReveal>
            </div>

            {/* Story Text */}
            <div className="lg:col-span-6 space-y-6">
              <ScrollReveal>
                <div className="inline-flex items-center space-x-2 text-primary text-xs font-bold uppercase tracking-wider font-body">
                  <Heart className="w-4 h-4 fill-primary" />
                  <span>About Mesxico Cakes &amp; Nuts</span>
                </div>
              </ScrollReveal>

              <ScrollReveal>
                <h2 className="font-display font-medium text-2xl sm:text-3xl text-on-surface leading-tight">
                  Baked with Care. Roasted to Perfection.
                </h2>
              </ScrollReveal>

              <ScrollReveal>
                <p className="text-base text-on-surface-variant font-body leading-relaxed">
                  At Mesxico, we believe that every snack should be an experience. What started as a passion for wholesome, premium treats has grown into a carefully curated collection of freshly baked cakes, rich chocolate spreads, and perfectly crunchy nuts.
                </p>
              </ScrollReveal>

              <ScrollReveal>
                <p className="text-base text-on-surface-variant font-body leading-relaxed">
                  We never compromise on what matters most: quality and freshness. From our choice cashews to our classic peanut burgers and soft cupcakes. We hygienically seal every order to preserve its natural flavor, ensuring that whether you are celebrating a special milestone or just satisfying an afternoon craving, every bite is simply irresistible.
                </p>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DIVIDER: About Us (surface) → Testimonials (surface-variant) ===== */}
      <BrushStrokeDivider variant="content-to-variant" />

      {/* =========================================================================
          6. CUSTOMER TESTIMONIALS / REVIEWS
          ========================================================================= */}
      <section
        style={{ backgroundColor: 'var(--color-surface-variant)' }}
        className="pt-10 sm:pt-14 pb-12 sm:pb-16 relative"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 relative z-10">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
              <span className="font-display italic text-base sm:text-lg text-primary">
                Real Reviews
              </span>
              <h2 className="font-display font-medium text-2xl sm:text-3xl text-on-surface mt-1.5 uppercase tracking-tight">
                What Our Customers Say
              </h2>
            </div>
          </ScrollReveal>

          {/* Ordered Sequential Reviews Grid with Glassmorphism Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Review 1: Ayo */}
            <ScrollReveal staggerIndex={0} className="h-full">
              <div className="h-full p-6 sm:p-7 rounded-3xl bg-white/50 backdrop-blur-md border border-white/70 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_35px_rgb(0,0,0,0.08)] hover:bg-white/65 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex text-[#F59E0B]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-on-surface-variant font-body italic leading-relaxed">
                    &quot;I really like how fresh and crunchy your groundnut tastes. Once it’s opened, the fresh aroma fills the room. It’s a my favorite, honestly. Would definitely be coming to get more once I finish these bottles I have, lol.&quot;
                  </p>
                </div>
                <div className="pt-3 border-t border-outline-variant/30">
                  <span className="font-bold text-sm text-on-surface font-body block">Ayo.</span>
                  <span className="text-xs text-outline font-body">Verified Customer</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Review 2: Ngozi */}
            <ScrollReveal staggerIndex={1} className="h-full">
              <div className="h-full p-6 sm:p-7 rounded-3xl bg-white/50 backdrop-blur-md border border-white/70 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_35px_rgb(0,0,0,0.08)] hover:bg-white/65 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex text-[#F59E0B]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-on-surface-variant font-body italic leading-relaxed">
                    &quot;Your cashewnuts is top notch will be pleased to have it again,bought a bottle of 75cl finished it in a space of a day, just to let you know how sweet the nut is.&quot;
                  </p>
                </div>
                <div className="pt-3 border-t border-outline-variant/30">
                  <span className="font-bold text-sm text-on-surface font-body block">Ngozi.</span>
                  <span className="text-xs text-outline font-body">Verified Customer</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Review 3: Ogbonna */}
            <ScrollReveal staggerIndex={2} className="h-full">
              <div className="h-full p-6 sm:p-7 rounded-3xl bg-white/50 backdrop-blur-md border border-white/70 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_35px_rgb(0,0,0,0.08)] hover:bg-white/65 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex text-[#F59E0B]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-on-surface-variant font-body italic leading-relaxed">
                    &quot;The Groundnuts are extra Crunchy and tasty. Also the Chocolate spread is top notch.&quot;
                  </p>
                </div>
                <div className="pt-3 border-t border-outline-variant/30">
                  <span className="font-bold text-sm text-on-surface font-body block">Ogbonna</span>
                  <span className="text-xs text-outline font-body">Verified Customer</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Review 4: Pearl */}
            <ScrollReveal staggerIndex={3} className="h-full">
              <div className="h-full p-6 sm:p-7 rounded-3xl bg-white/50 backdrop-blur-md border border-white/70 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_35px_rgb(0,0,0,0.08)] hover:bg-white/65 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex text-[#F59E0B]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-on-surface-variant font-body italic leading-relaxed">
                    &quot;My number one plug for cupcakes. It cant be any better.&quot;
                  </p>
                </div>
                <div className="pt-3 border-t border-outline-variant/30">
                  <span className="font-bold text-sm text-on-surface font-body block">Pearl.</span>
                  <span className="text-xs text-outline font-body">Verified Customer</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Review 5: Faith */}
            <ScrollReveal staggerIndex={4} className="h-full">
              <div className="h-full p-6 sm:p-7 rounded-3xl bg-white/50 backdrop-blur-md border border-white/70 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_35px_rgb(0,0,0,0.08)] hover:bg-white/65 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex text-[#F59E0B]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-on-surface-variant font-body italic leading-relaxed">
                    &quot;Yes , the Groundnuts are fresh, taste delicious &amp; crunchy based on my taste &amp; feedback from my friends 👌&quot;
                  </p>
                </div>
                <div className="pt-3 border-t border-outline-variant/30">
                  <span className="font-bold text-sm text-on-surface font-body block">Faith..</span>
                  <span className="text-xs text-outline font-body">Verified Customer</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===== DIVIDER: Reviews (surface-variant) → Contact Us (surface) ===== */}
      <BrushStrokeDivider variant="variant-to-content" />

      {/* =========================================================================
          7. CONTACT US SECTION
          ========================================================================= */}
      <ContactSection />
    </div>
  );
}
