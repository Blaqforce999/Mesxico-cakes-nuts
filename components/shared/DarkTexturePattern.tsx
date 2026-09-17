import React from 'react';

/**
 * Subtle repeating SVG pattern of faint food-related line icons.
 * Positioned absolutely inside dark-background sections to create
 * a barely-visible charcoal texture (approximately 6% opacity).
 *
 * The icons are simple line-art outlines of food items and utensils.
 * They tile seamlessly across the section surface.
 */
export function DarkTexturePattern() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
      style={{ opacity: 0.06 }}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="food-texture-pattern"
            x="0"
            y="0"
            width="180"
            height="180"
            patternUnits="userSpaceOnUse"
          >
            {/* Cake slice — top-left area */}
            <g
              stroke="currentColor"
              fill="none"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              transform="translate(15, 12) scale(0.9)"
            >
              <path d="M5,28 L15,4 L25,28 Z" />
              <line x1="5" y1="28" x2="25" y2="28" />
              <path d="M8,20 Q15,16 22,20" />
              <circle cx="12" cy="10" r="1.2" />
              <circle cx="18" cy="14" r="1" />
            </g>

            {/* Cupcake — center-right area */}
            <g
              stroke="currentColor"
              fill="none"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              transform="translate(110, 15) rotate(12)"
            >
              <path d="M6,18 L4,28 L22,28 L20,18" />
              <path d="M5,18 Q8,6 13,10 Q18,6 21,18" />
              <circle cx="13" cy="8" r="1.5" />
            </g>

            {/* Fork — mid-left */}
            <g
              stroke="currentColor"
              fill="none"
              strokeWidth="1.1"
              strokeLinecap="round"
              transform="translate(20, 75) rotate(-15)"
            >
              <line x1="8" y1="0" x2="8" y2="30" />
              <line x1="4" y1="0" x2="4" y2="12" />
              <line x1="8" y1="0" x2="8" y2="12" />
              <line x1="12" y1="0" x2="12" y2="12" />
              <path d="M4,12 Q8,16 12,12" />
            </g>

            {/* Nut / Cashew shape — center */}
            <g
              stroke="currentColor"
              fill="none"
              strokeWidth="1.2"
              strokeLinecap="round"
              transform="translate(82, 80) rotate(8)"
            >
              <path d="M4,14 Q2,6 10,4 Q18,2 20,10 Q22,18 14,20 Q6,22 4,14 Z" />
              <path d="M8,10 Q12,8 14,12" />
            </g>

            {/* Whisk — bottom-right */}
            <g
              stroke="currentColor"
              fill="none"
              strokeWidth="1.1"
              strokeLinecap="round"
              transform="translate(135, 90) rotate(-20)"
            >
              <line x1="10" y1="0" x2="10" y2="12" />
              <path d="M4,12 Q6,24 10,28 Q14,24 16,12" />
              <path d="M6,14 Q10,22 14,14" />
            </g>

            {/* Cherry pair — top center */}
            <g
              stroke="currentColor"
              fill="none"
              strokeWidth="1.2"
              strokeLinecap="round"
              transform="translate(68, 20) rotate(-5)"
            >
              <circle cx="6" cy="16" r="5" />
              <circle cx="18" cy="14" r="4.5" />
              <path d="M8,11 Q10,2 12,0" />
              <path d="M16,10 Q14,3 12,0" />
              <path d="M12,0 Q16,-2 18,2" />
            </g>

            {/* Spoon — bottom-left */}
            <g
              stroke="currentColor"
              fill="none"
              strokeWidth="1.2"
              strokeLinecap="round"
              transform="translate(15, 130) rotate(10)"
            >
              <line x1="8" y1="14" x2="8" y2="32" />
              <ellipse cx="8" cy="8" rx="6" ry="8" />
            </g>

            {/* Small star / sparkle — far right mid */}
            <g
              stroke="currentColor"
              fill="none"
              strokeWidth="1"
              strokeLinecap="round"
              transform="translate(155, 55)"
            >
              <line x1="6" y1="0" x2="6" y2="12" />
              <line x1="0" y1="6" x2="12" y2="6" />
              <line x1="2" y1="2" x2="10" y2="10" />
              <line x1="10" y1="2" x2="2" y2="10" />
            </g>

            {/* Donut/Ring — bottom center */}
            <g
              stroke="currentColor"
              fill="none"
              strokeWidth="1.2"
              strokeLinecap="round"
              transform="translate(80, 138)"
            >
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="4" />
            </g>

            {/* Small scattered dots for extra texture */}
            <circle cx="50" cy="55" r="1" stroke="currentColor" fill="none" />
            <circle cx="130" cy="140" r="1.2" stroke="currentColor" fill="none" />
            <circle cx="160" cy="165" r="0.8" stroke="currentColor" fill="none" />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#food-texture-pattern)"
          style={{ color: 'var(--color-surface)' }}
        />
      </svg>
    </div>
  );
}
