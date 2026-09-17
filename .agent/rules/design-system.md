---
trigger: always_on
---

# Rule: Design System

## Token Files Are the Source of Truth
The project relies on one specific token file acting as the absolute source of truth. The agent must never modify them:

- `tokens/tokens.css` — all color values (including M3 semantic tokens), all font sizes, weights, line heights, and font families, all spacing scales and border radius. 

This token file export CSS custom properties (CSS variables) that are available globally across the application.

## Mandatory: Use CSS Variables, Never Raw Values
The agent must never write hardcoded color values or typography values anywhere in this codebase. 

Wrong:
color: #ED1E26;
font-size: 16px;
font-family: 'Inter', sans-serif;
padding: 16px;

Correct:
color: var(--color-primary);
font-size: var(--font-size-base);
font-family: var(--font-family-body);
padding: var(--spacing-16);

Before writing any style value, check the token files. If a variable exists for what you need, use it. If it does not exist, ask before inventing a new value.

## Styling Implementation
All styles must consume the CSS variables defined in the token files. If the project utilizes Tailwind CSS, these variables must be mapped within the `tailwind.config.ts` file so they can be applied via utility classes (e.g., `bg-primary`, `font-display`). Arbitrary values (e.g., `text-[15px]` or `bg-[#ED1E26]`) are strictly prohibited.

## Mobile-First
Mesxico Cakes and Nuts users are primarily on mobile. Every component must be built mobile-first:

- Default styles target mobile (small screens).
- Use proper breakpoints (e.g., `md:`, `lg:` or `@media (min-width: 768px)`) to layer in desktop styles.
- Touch targets must be a minimum of 44px tall.
- The product checkout page must be fully functional on a 375px viewport.