'use client';

import React from 'react';
import Image from 'next/image';
import {
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  ArrowUpRight,
} from 'lucide-react';

function WhatsAppIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.41a8.165 8.165 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.59c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.65.81-.79.98-.15.17-.29.19-.54.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43l-.48-.01c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.07-.1-.23-.17-.48-.29" />
    </svg>
  );
}

function TikTokIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.43c.48-.48.86-1.05 1.11-1.68.27-.7.41-1.44.41-2.19V8.65a8.28 8.28 0 0 0 4.21 1.15v-3.11z" />
    </svg>
  );
}

export function ContactSection() {
  return (
    <section id="contact" className="pt-10 sm:pt-14 pb-16 sm:pb-20 bg-surface scroll-mt-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-1.5">
          <h2 className="font-display font-medium text-2xl sm:text-3xl text-on-surface mt-1.5 uppercase tracking-tight">
            Quick Answers &amp; Support
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant font-body max-w-lg mx-auto leading-relaxed pt-1">
            Skip the waiting. Reach us instantly on WhatsApp, email, or phone for the fastest response on orders, custom celebration cakes, and gourmet nuts.
          </p>
        </div>

        {/* Framed Luxury Contact Showcase Card */}
        <div className="rounded-[2rem] sm:rounded-[2.5rem] p-3 sm:p-5 md:p-6 bg-gradient-to-br from-[#F5F2ED] via-[#FAF8F5] to-[#ECE6DE] border border-[#C5A880]/50 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-stretch">
            
            {/* LEFT COLUMN: Scaled-Up Product Visual with Location Box */}
            <div className="lg:col-span-5 relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#FAF8F5] to-[#EFECE8] border border-white/80 shadow-md flex flex-col justify-between p-4 sm:p-5 min-h-[380px] sm:min-h-[460px] lg:min-h-[500px]">
              
              {/* Product Image: Scaled up to fill the upper area previously occupied by the badge */}
              <div className="absolute inset-x-2 top-2 bottom-20 sm:bottom-24 flex items-center justify-center p-1 sm:p-2">
                <div className="relative w-full h-full max-w-[420px] max-h-[420px]">
                  <Image
                    src="/product_images/spread_with_nuts.jpg"
                    alt="Mesxico Nutty Chocolate Spread surrounded by unpeeled groundnuts and roasted cashew nuts"
                    fill
                    sizes="(max-width: 1024px) 100vw, 480px"
                    className="object-contain drop-shadow-xl rounded-xl"
                    priority
                  />
                </div>
              </div>

              {/* Bottom Location Box: Address only (Time removed as requested) */}
              <div className="relative z-10 self-stretch mt-auto pt-4">
                <div className="p-3.5 sm:p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-black/5 shadow-md text-xs font-body text-on-surface">
                  <div className="flex items-start space-x-2.5">
                    <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="font-medium text-on-surface leading-snug">
                      11, Moriamo Adesina Street AdeAde bus stop Abaranje, Ikotun, Nigeria, 23401
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Contact Channels (Glassmorphic Dark Glass Style) */}
            <div className="lg:col-span-7 bg-gradient-to-br from-[#282022]/95 via-[#1C1517]/90 to-[#130E10]/95 backdrop-blur-xl text-white rounded-2xl p-5 sm:p-7 lg:p-8 flex flex-col justify-between border border-white/15 shadow-2xl shadow-black/40">
              
              {/* Top Group: Header & Direct Actions */}
              <div className="space-y-3.5 sm:space-y-4">
                {/* Title & Subtext */}
                <div className="space-y-1">
                  <h3 className="font-body font-semibold text-xl sm:text-2xl text-white tracking-tight">
                    CONNECT &amp; INQUIRE
                  </h3>
                  <p className="text-xs sm:text-sm text-outline-variant font-body leading-relaxed max-w-lg">
                    For orders, custom requests, or sharing your nut butter passion. Every nut-loving customer is important to us.
                  </p>
                </div>

                {/* Action Buttons Area */}
                <div className="space-y-3">
                  
                  {/* 1. SINGLE PRIMARY CALL TO ACTION: WhatsApp */}
                  <a
                    href="https://wa.me/2347030420150?text=Hello%20Mesxico%20Cakes%20%26%20Nuts!%20I%20have%20an%20inquiry%20regarding%20an%20order."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between py-2.5 px-3.5 sm:py-3 sm:px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white shadow-md shadow-[#25D366]/20 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] group"
                  >
                    <div className="flex items-center space-x-2.5 sm:space-x-3">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <WhatsAppIcon className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left">
                        <span className="font-body font-bold text-xs sm:text-sm block tracking-wide leading-tight">
                          CHAT NOW ON WHATSAPP
                        </span>
                        <span className="text-[11px] text-white/95 font-body block">
                          +234 7030420150 &bull; (Fastest Response for Orders)
                        </span>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 opacity-90 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2" />
                  </a>

                  {/* Secondary Channels: Gmail & Direct Call (with vertical breathing room after WhatsApp) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-0.5">
                    
                    {/* Gmail / Email Channel */}
                    <a
                      href="mailto:mesxicofoods@gmail.com"
                      className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary-container/30 text-white transition-all duration-200 group"
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                          <Mail className="w-3.5 h-3.5 text-primary-container" />
                        </div>
                        <div className="text-left min-w-0">
                          <span className="font-body font-medium text-xs sm:text-sm text-white block truncate">
                            Send Email
                          </span>
                          <span className="text-[11px] text-outline-variant font-body block truncate">
                            mesxicofoods@gmail.com
                          </span>
                        </div>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-outline-variant group-hover:text-white transition-colors shrink-0 ml-1.5" />
                    </a>

                    {/* Direct Call */}
                    <a
                      href="tel:+2347030420150"
                      className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary-container/30 text-white transition-all duration-200 group"
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                          <Phone className="w-3.5 h-3.5 text-primary-container" />
                        </div>
                        <div className="text-left min-w-0">
                          <span className="font-body font-medium text-xs sm:text-sm text-white block truncate">
                            Direct Call
                          </span>
                          <span className="text-[11px] text-outline-variant font-body block truncate">
                            +234 7030420150
                          </span>
                        </div>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-outline-variant group-hover:text-white transition-colors shrink-0 ml-1.5" />
                    </a>

                  </div>
                </div>
              </div>

              {/* Bottom Group: Other Ways to Connect */}
              <div className="space-y-2.5 mt-2 sm:mt-2.5">
                <span className="text-[11px] font-medium tracking-wider uppercase text-outline-variant/80 font-body block">
                  Other Ways to Connect
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2.5 gap-y-3 sm:gap-y-3.5 text-xs sm:text-sm font-body text-outline-variant">
                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/mesxicofoods?igsi=MWk4ZjQ4NW8xaW43aQ=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/5 hover:border-white/15 hover:text-white transition-all group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500/20 via-rose-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Instagram className="w-4 h-4 text-pink-400" />
                    </div>
                    <span className="font-medium text-white/90 group-hover:text-white truncate">@mesxicofoods</span>
                  </a>

                  {/* Phone */}
                  <a
                    href="tel:+2347030420150"
                    className="flex items-center space-x-3 p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/5 hover:border-white/15 hover:text-white transition-all group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Phone className="w-4 h-4 text-primary-container" />
                    </div>
                    <span className="font-medium text-white/90 group-hover:text-white truncate">+234 7030420150</span>
                  </a>

                  {/* Facebook */}
                  <a
                    href="https://www.facebook.com/share/1BxYoGLDLU/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/5 hover:border-white/15 hover:text-white transition-all group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#1877F2]/20 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Facebook className="w-4 h-4 text-[#1877F2]" />
                    </div>
                    <span className="font-medium text-white/90 group-hover:text-white truncate">/mesxicofoods</span>
                  </a>

                  {/* TikTok */}
                  <a
                    href="https://www.tiktok.com/@mesxico.foods?_r=1&_t=ZS-99PF2drPzlM"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/5 hover:border-white/15 hover:text-white transition-all group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <TikTokIcon className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-white/90 group-hover:text-white truncate">@mesxico.foods</span>
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
