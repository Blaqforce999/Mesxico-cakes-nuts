import React from 'react';

type BrushStrokeDividerProps = {
  /** Which landing page divider transition to render */
  variant:
    | 'hero-to-features'
    | 'features-to-content'
    | 'content-to-variant'
    | 'variant-to-content'
    | 'content-to-dark'
    | 'dark-to-content'
    | 'content-to-footer';
  className?: string;
};

/**
 * Exact authentic dry-brush paint stroke section dividers replicating the
 * torn/ragged bristle, micro-splatter, and dry-drag effect from the Brooklyn Suya reference.
 *
 * Utilizes high-precision alpha mask assets derived directly from the reference dividers:
 * - hero-to-features: Background -> Surface-variant brush stroke
 * - features-to-content: Surface-variant brush stroke -> Light cream surface
 * - content-to-variant: Light cream surface -> Surface-variant brush stroke
 * - variant-to-content: Surface-variant brush stroke -> Light cream surface
 * - content-to-dark: Light cream surface -> Dark on-background brush stroke
 * - dark-to-content: Dark on-background -> Light cream surface brush stroke
 *
 * Strictly applies CSS custom properties ensuring 100% compliance with design tokens.
 */
export function BrushStrokeDivider({
  variant,
  className,
}: BrushStrokeDividerProps) {
  switch (variant) {
    case 'hero-to-features':
      return (
        <div
          className={`relative w-full overflow-hidden select-none pointer-events-none -mt-px -mb-2 z-10 ${className ?? ''}`}
          style={{ backgroundColor: 'var(--color-background)' }}
          aria-hidden="true"
        >
          <div
            className="w-full"
            style={{
              height: 'clamp(60px, 7.5vw, 115px)',
              backgroundColor: 'var(--color-surface-variant)',
              WebkitMaskImage: "url('/dividers/brush-top-mask.png')",
              maskImage: "url('/dividers/brush-top-mask.png')",
              WebkitMaskSize: '100% calc(100% + 6px)',
              maskSize: '100% calc(100% + 6px)',
              WebkitMaskPosition: 'top center',
              maskPosition: 'top center',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              marginBottom: '-6px',
            }}
          />
        </div>
      );

    case 'features-to-content':
    case 'variant-to-content':
      return (
        <div
          className={`relative w-full overflow-hidden select-none pointer-events-none -mt-2 -mb-px z-10 ${className ?? ''}`}
          style={{ backgroundColor: 'var(--color-surface)' }}
          aria-hidden="true"
        >
          <div
            className="w-full"
            style={{
              height: 'clamp(60px, 7.5vw, 115px)',
              backgroundColor: 'var(--color-surface-variant)',
              WebkitMaskImage: "url('/dividers/brush-bottom-mask.png')",
              maskImage: "url('/dividers/brush-bottom-mask.png')",
              WebkitMaskSize: '100% calc(100% + 6px)',
              maskSize: '100% calc(100% + 6px)',
              WebkitMaskPosition: 'bottom center',
              maskPosition: 'bottom center',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              marginTop: '-6px',
            }}
          />
        </div>
      );

    case 'content-to-variant':
      return (
        <div
          className={`relative w-full overflow-hidden select-none pointer-events-none -mt-px -mb-2 z-10 ${className ?? ''}`}
          style={{ backgroundColor: 'var(--color-surface)' }}
          aria-hidden="true"
        >
          <div
            className="w-full"
            style={{
              height: 'clamp(60px, 7.5vw, 115px)',
              backgroundColor: 'var(--color-surface-variant)',
              WebkitMaskImage: "url('/dividers/brush-top-mask.png')",
              maskImage: "url('/dividers/brush-top-mask.png')",
              WebkitMaskSize: '100% calc(100% + 6px)',
              maskSize: '100% calc(100% + 6px)',
              WebkitMaskPosition: 'top center',
              maskPosition: 'top center',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              marginBottom: '-6px',
            }}
          />
        </div>
      );

    case 'content-to-dark':
      return (
        <div
          className={`relative w-full overflow-hidden select-none pointer-events-none -mt-px -mb-2 z-10 ${className ?? ''}`}
          style={{ backgroundColor: 'var(--color-surface)' }}
          aria-hidden="true"
        >
          <div
            className="w-full"
            style={{
              height: 'clamp(60px, 7.5vw, 115px)',
              backgroundColor: 'var(--color-on-surface-variant)',
              WebkitMaskImage: "url('/dividers/brush-dark-mask.png')",
              maskImage: "url('/dividers/brush-dark-mask.png')",
              WebkitMaskSize: '100% calc(100% + 6px)',
              maskSize: '100% calc(100% + 6px)',
              WebkitMaskPosition: 'top center',
              maskPosition: 'top center',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              marginBottom: '-6px',
            }}
          />
        </div>
      );

    case 'dark-to-content':
      return (
        <div
          className={`relative w-full overflow-hidden select-none pointer-events-none -mt-px -mb-2 z-10 ${className ?? ''}`}
          style={{ backgroundColor: 'var(--color-on-surface-variant)' }}
          aria-hidden="true"
        >
          <div
            className="w-full"
            style={{
              height: 'clamp(60px, 7.5vw, 115px)',
              backgroundColor: 'var(--color-surface)',
              WebkitMaskImage: "url('/dividers/brush-top-mask.png')",
              maskImage: "url('/dividers/brush-top-mask.png')",
              WebkitMaskSize: '100% calc(100% + 6px)',
              maskSize: '100% calc(100% + 6px)',
              WebkitMaskPosition: 'top center',
              maskPosition: 'top center',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              marginBottom: '-6px',
            }}
          />
        </div>
      );

    case 'content-to-footer':
      return (
        <div
          className={`relative w-full overflow-hidden select-none pointer-events-none -mt-px -mb-2 z-10 ${className ?? ''}`}
          style={{ backgroundColor: 'var(--color-surface)' }}
          aria-hidden="true"
        >
          <div
            className="w-full"
            style={{
              height: 'clamp(40px, 5vw, 75px)',
              backgroundColor: 'var(--color-on-primary-container)',
              WebkitMaskImage: "url('/dividers/brush-footer-clean.png')",
              maskImage: "url('/dividers/brush-footer-clean.png')",
              WebkitMaskSize: '100% calc(100% + 4px)',
              maskSize: '100% calc(100% + 4px)',
              WebkitMaskPosition: 'top center',
              maskPosition: 'top center',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              marginBottom: '-4px',
            }}
          />
        </div>
      );
  }
}
