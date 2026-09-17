# Component Builder Skill

Load this skill whenever you are creating or modifying a React component in Mesxico Cakes and Nuts. It tells you where the component goes, how it should be structured, and how to wire it up to the design system without reinventing anything.

## Before You Start

Read `.agents/rules/design-system.md` first. Components that do not follow the design system get rejected at review. This skill assumes you already know the tokens, the spacing scale, and the component primitives.

Then ask: does this component already exist? Search `components/` before adding a new one. Two slightly different `Button` components is how codebases rot.

## Where Components Live

    components/
    ├── ui/                  primitives: Button, Input, Card, Badge, Avatar, etc.
    ├── storefront/          anything specific to the product domain (ProductCard, ProductImage, PriceTag)
    ├── admin/               anything that only exists inside the seller dashboard (OrdersTable, ProductList)
    └── shared/              composites used across more than one domain (EmptyState, PageHeader)

If a component is used exactly once and it is complex, it can live next to the page that uses it in `app/.../_components/`. Promote it to `components/` when a second caller shows up.

## Component File Template

    // components/<folder>/<ComponentName>.tsx

    type <ComponentName>Props = {
      children?: React.ReactNode;
      className?: string;
    };

    export function <ComponentName>({ children, className }: <ComponentName>Props) {
      return (
        <div className={`base-tailwind-classes ${className ?? ''}`}>
          {children}
        </div>
      );
    }

Notes:
- Named export, not default export. Default exports make renaming harder and break auto-imports.
- `className` prop is always accepted on components that render a single root element. Use a template literal with `${className ?? ''}` for merging.
- Props type goes above the component, named `<ComponentName>Props`.
- Required props come before optional ones in the type definition.

## Server vs. Client Components

Default to server components. A component becomes a client component only when it needs one of these:
- React state (`useState`, `useReducer`)
- Effects (`useEffect`, `useLayoutEffect`)
- Browser-only APIs (`window`, `document`, `localStorage`)
- Event handlers that are more than a simple link (`onClick`, `onChange`)
- Context consumption for interactivity

If you add `"use client"`, put it on the first line of the file. Do not add it defensively.

Keep the client boundary as low in the tree as possible. A page that is mostly static but has one interactive button should not be a client component; the button should be.

## Styling

All styling uses Tailwind CSS mapped directly to our CSS variables from the three token files (`tokens/color.css`, `tokens/typography.css`, `tokens/spacing.css`). Never hardcode color values, font sizes, or spacing.

    // Button.tsx
    
    // In the component
    <button className={`inline-flex items-center justify-center p-2 bg-primary text-on-primary rounded-md font-body ${className ?? ''}`}>

If you find yourself writing custom hex values or arbitrary pixel values, stop. Use the mapped Tailwind configuration or add new tokens to the token CSS files (with developer approval).

## Variants

For components with variants (Button, Badge), define variant dictionaries and apply them conditionally:

    // Button.tsx
    
    type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
      variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
      size?: 'sm' | 'md' | 'lg';
    };

    export function Button({
      variant = 'primary',
      size = 'md',
      className,
      ...props
    }: ButtonProps) {
      
      const variants = {
        primary: "bg-primary text-on-primary hover:opacity-90",
        secondary: "bg-surface text-on-surface border border-outline",
        ghost: "bg-transparent text-on-surface hover:bg-surface",
        danger: "bg-error text-on-error"
      };

      const sizes = {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-4 text-base",
        lg: "h-12 px-6 text-lg"
      };

      return (
        <button
          className={`inline-flex items-center justify-center rounded-md font-body ${variants[variant]} ${sizes[size]} ${className ?? ''}`}
          {...props}
        />
      );
    }

## Accessibility

Every interactive element needs a keyboard-reachable focus state. 

Buttons without visible text need `aria-label`. Icon-only buttons are the most common offender. Do not let them ship without a label.

Form inputs need associated labels via `htmlFor`/`id`. Error messages are linked via `aria-describedby`.

Images need `alt`. Decorative images use `alt=""`. Do not omit the attribute.

## Props to Avoid

- Do not expose raw color props (`color="red"`). Use variants.
- Do not expose raw size values in pixels. Use the size variants.
- Do not accept arbitrary inline styles via a `style` prop unless there is a specific reason (like a dynamic value that cannot be expressed in CSS).

## Common Mistakes

- Creating a new primitive when an existing one would work with a new variant. Extend, do not duplicate.
- Forgetting `className` prop on a component that might need to be laid out differently in different places.
- Making a component a client component because it was easier, when a server component would have worked.
- Using arbitrary pixel values instead of the mapped spacing scale. 
- Hardcoding colors instead of using the design tokens.
- Adding complex logic inside the JSX. Extract to a named constant or helper above the return.