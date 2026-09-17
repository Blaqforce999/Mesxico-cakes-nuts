import React from 'react';
import Image from 'next/image';
import { Heart, Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react';
import { BrushStrokeDivider } from './BrushStrokeDivider';

export function Footer() {
  return (
    <footer
      style={{ backgroundColor: 'var(--color-on-primary-container)' }}
      className="text-[#FFFBFB] relative pb-6 sm:pb-8"
    >
      <BrushStrokeDivider variant="content-to-footer" />
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 pt-2 sm:pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-start">
          {/* Column 1: Brand Logo */}
          <div className="flex flex-col items-start pt-1">
            <div className="relative h-12 w-32 sm:h-14 sm:w-36">
              <Image
                src="/logo.png"
                alt="Mesxico Cakes & Packaged Nuts"
                fill
                className="object-contain object-left"
              />
            </div>
          </div>

          {/* Column 2: Kitchen & Support */}
          <div className="space-y-2.5">
            <h4 className="font-display text-base font-semibold text-white">
              Kitchen &amp; Support
            </h4>
            <ul className="space-y-2 text-sm font-body text-outline-variant">
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-primary-container shrink-0 mt-0.5" />
                <span className="leading-snug">
                  11, Moriamo Adesina Street AdeAde bus stop Abaranje, Ikotun, Nigeria, 23401
                </span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-primary-container shrink-0" />
                <a href="tel:+2347030420150" className="hover:text-white transition-colors">
                  +234 7030420150
                </a>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-primary-container shrink-0" />
                <a href="mailto:mesxicofoods@gmail.com" className="hover:text-white transition-colors">
                  mesxicofoods@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Social Media Handles */}
          <div className="space-y-2.5">
            <h4 className="font-display text-base font-semibold text-white">
              Follow Us
            </h4>
            <p className="text-sm text-outline-variant font-body leading-relaxed">
              Connect with us for our daily fresh bakes, behind-the-scenes, and gourmet treats.
            </p>
            <div className="flex items-center space-x-3 pt-0.5">
              <a
                href="https://www.instagram.com/mesxicofoods?igsi=MWk4ZjQ4NW8xaW43aQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center transition-all duration-300 border border-white/15 hover:border-transparent hover:scale-105 overflow-hidden shadow-sm"
                aria-label="Instagram"
              >
                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
                  style={{
                    background:
                      'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)',
                  }}
                />
                <Instagram className="w-4 h-4 relative z-10 text-white transition-transform duration-200 group-hover:scale-110" />
              </a>
              <a
                href="https://www.facebook.com/share/1BxYoGLDLU/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center transition-all duration-300 border border-white/15 hover:border-[#1877F2] hover:bg-[#1877F2] hover:scale-105 overflow-hidden shadow-sm"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 relative z-10 text-white transition-transform duration-200 group-hover:scale-110" />
              </a>
              <a
                href="https://www.tiktok.com/@mesxico.foods?_r=1&_t=ZS-99PF2drPzlM"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center transition-all duration-300 border border-white/15 hover:border-black hover:bg-black hover:scale-105 overflow-hidden shadow-sm"
                aria-label="TikTok"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 relative z-10 text-white transition-transform duration-200 group-hover:scale-110"
                  aria-hidden="true"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.43c.48-.48.86-1.05 1.11-1.68.27-.7.41-1.44.41-2.19V8.65a8.28 8.28 0 0 0 4.21 1.15v-3.11z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Made with love on the left, copyright strictly aligned on the vertical line of Follow Us (Column 3) */}
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-white/15 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-center text-xs text-outline-variant font-body">
          <div className="md:col-span-2 flex items-center space-x-1.5 text-outline-variant font-body">
            <span>Made with</span>
            <Heart
              className="w-3.5 h-3.5 inline text-primary fill-primary"
              style={{
                color: 'var(--color-primary)',
                fill: 'var(--color-primary)',
              }}
            />
            <span>in Nigeria</span>
          </div>
          <div className="md:col-span-1">
            <p>
              &copy; {new Date().getFullYear()} Mesxico Cakes &amp; Nuts. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
