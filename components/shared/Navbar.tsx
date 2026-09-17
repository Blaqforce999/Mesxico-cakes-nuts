'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCartStore } from '@/lib/cart/cart-store';

const NAV_LINKS = [
  { id: 'hero' as const, label: 'Home', href: '/#hero' },
  { id: 'about' as const, label: 'About Us', href: '/#about' },
  { id: 'contact' as const, label: 'Contact Us', href: '/#contact' },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<'hero' | 'about' | 'contact'>('hero');
  const pathname = usePathname();
  const items = useCartStore((state) => state.items);
  const openCart = useCartStore((state) => state.openCart);

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (pathname !== '/') return;

    const handleScrollSpy = () => {
      const scrollPosition = window.scrollY + 260;
      const contactEl = document.getElementById('contact');
      const aboutEl = document.getElementById('about');

      if (contactEl && scrollPosition >= contactEl.offsetTop) {
        setActiveSection('contact');
      } else if (aboutEl && scrollPosition >= aboutEl.offsetTop) {
        setActiveSection('about');
      } else {
        setActiveSection('hero');
      }
    };

    handleScrollSpy();
    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, [pathname]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: 'hero' | 'about' | 'contact') => {
    if (pathname === '/') {
      e.preventDefault();
      setActiveSection(targetId);
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
      }
    } else {
      setMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 backdrop-blur-xl ${
        isScrolled ? 'shadow-xs' : ''
      }`}
      style={{
        backgroundColor: isScrolled
          ? 'color-mix(in srgb, var(--color-surface-variant) 45%, transparent)'
          : 'color-mix(in srgb, var(--color-background) 70%, transparent)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo (Always on the Left) */}
          <Link
            href="/#hero"
            onClick={(e) => handleNavClick(e, 'hero')}
            className="flex items-center transition-transform hover:scale-[1.02] active:scale-[0.98]"
            aria-label="Mesxico Cakes and Nuts Home"
          >
            <div className="relative h-11 sm:h-14 w-24 sm:w-32">
              <Image
                src="/logo.png"
                alt="Mesxico Cakes and Nuts"
                fill
                sizes="(max-width: 640px) 96px, 128px"
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-7">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === '/' && activeSection === link.id;
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={`text-sm font-semibold font-body py-2 transition-colors duration-200 ${
                    isActive ? 'text-primary' : 'text-on-surface hover:text-primary'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Group: Cart & Sign-In/Profile on Desktop, Cart & Hamburger on Mobile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Cart Button (Always visible on mobile & desktop) */}
            <button
              type="button"
              onClick={openCart}
              className="relative p-2.5 rounded-full text-on-surface hover:bg-surface-variant hover:text-primary transition-all min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-95"
              aria-label={`Shopping cart with ${itemCount} items`}
            >
              <ShoppingBag className="w-5 h-5 text-on-surface" />
              {itemCount > 0 && (
                <span className="absolute top-1.5 right-1.5 inline-flex items-center justify-center bg-primary text-on-primary text-[10px] font-bold w-4 h-4 rounded-full font-body shadow-xs animate-pulse">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button (Positioned on the Right next to Cart) */}
            <div className="flex items-center md:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-lg text-on-surface hover:bg-surface-variant min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div
          className="md:hidden px-4 pt-3 pb-6 space-y-2.5 shadow-lg animate-in slide-in-from-top-2 duration-200 transition-colors backdrop-blur-xl"
          style={{
            backgroundColor: isScrolled
              ? 'color-mix(in srgb, var(--color-surface-variant) 70%, transparent)'
              : 'color-mix(in srgb, var(--color-background) 80%, transparent)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          }}
        >
          {NAV_LINKS.map((link) => {
            const isActive = pathname === '/' && activeSection === link.id;
            return (
              <Link
                key={link.id}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.id)}
                className={`py-2.5 px-3 rounded-lg text-base font-semibold font-body min-h-[44px] flex items-center transition-colors ${
                  isActive ? 'text-primary bg-primary/5' : 'text-on-surface hover:bg-surface-variant'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
