# Improv Panic Button - Theme Rules

## Overview
This document defines the complete visual theme for the Improv Panic Button application, including colors, typography, spacing, shadows, and component styling. All values are optimized for the "Professional Gaming" aesthetic and the specific needs of Dungeon Masters.

## Design Tokens

### Core Color Palette

#### Primary Colors
```css
/* Deep Navy - Primary brand color, professional and trustworthy */
--color-primary-50: #f0f4ff;
--color-primary-100: #e0eaff;
--color-primary-200: #c7d7fe;
--color-primary-300: #a5bcfc;
--color-primary-400: #8195f8;
--color-primary-500: #6366f1;  /* Primary brand */
--color-primary-600: #4f46e5;
--color-primary-700: #4338ca;
--color-primary-800: #3730a3;
--color-primary-900: #312e81;
--color-primary-950: #1e1b4b;

/* Rich Purple - Secondary brand color, sophisticated gaming feel */
--color-secondary-50: #faf7ff;
--color-secondary-100: #f3edff;
--color-secondary-200: #e9deff;
--color-secondary-300: #d6c2ff;
--color-secondary-400: #bc98ff;
--color-secondary-500: #a855f7;  /* Secondary brand */
--color-secondary-600: #9333ea;
--color-secondary-700: #7c2d12;
--color-secondary-800: #6b21a8;
--color-secondary-900: #581c87;
--color-secondary-950: #3b0764;
```

#### Functional Colors
```css
/* Success - Forest Green, natural and reassuring */
--color-success-50: #f0fdf4;
--color-success-100: #dcfce7;
--color-success-200: #bbf7d0;
--color-success-300: #86efac;
--color-success-400: #4ade80;
--color-success-500: #22c55e;
--color-success-600: #16a34a;  /* Primary success */
--color-success-700: #15803d;
--color-success-800: #166534;
--color-success-900: #14532d;
--color-success-950: #052e16;

/* Warning - Warm Amber, confident and attention-getting */
--color-warning-50: #fffbeb;
--color-warning-100: #fef3c7;
--color-warning-200: #fde68a;
--color-warning-300: #fcd34d;
--color-warning-400: #fbbf24;
--color-warning-500: #f59e0b;  /* Primary warning */
--color-warning-600: #d97706;
--color-warning-700: #b45309;
--color-warning-800: #92400e;
--color-warning-900: #78350f;
--color-warning-950: #451a03;

/* Error - Confident Red, clear but not alarming */
--color-error-50: #fef2f2;
--color-error-100: #fee2e2;
--color-error-200: #fecaca;
--color-error-300: #fca5a5;
--color-error-400: #f87171;
--color-error-500: #ef4444;
--color-error-600: #dc2626;  /* Primary error */
--color-error-700: #b91c1c;
--color-error-800: #991b1b;
--color-error-900: #7f1d1d;
--color-error-950: #450a0a;

/* Panic Button - Special bright red for urgency */
--color-panic-50: #fef2f2;
--color-panic-100: #fee2e2;
--color-panic-200: #fecaca;
--color-panic-300: #fca5a5;
--color-panic-400: #f87171;
--color-panic-500: #ef4444;
--color-panic-600: #dc2626;  /* Panic button primary */
--color-panic-700: #b91c1c;
--color-panic-800: #991b1b;
--color-panic-900: #7f1d1d;
--color-panic-950: #450a0a;
```

#### Neutral Colors (Light Theme)
```css
/* Cool Gray - Professional and clean */
--color-neutral-50: #f8fafc;   /* Page background */
--color-neutral-100: #f1f5f9;  /* Card background */
--color-neutral-200: #e2e8f0;  /* Border light */
--color-neutral-300: #cbd5e1;  /* Border */
--color-neutral-400: #94a3b8;  /* Text muted */
--color-neutral-500: #64748b;  /* Text secondary */
--color-neutral-600: #475569;  /* Text primary light */
--color-neutral-700: #334155;  /* Text primary */
--color-neutral-800: #1e293b;  /* Text heading */
--color-neutral-900: #0f172a;  /* Text display */
--color-neutral-950: #020617;  /* Maximum contrast */
```

#### Dark Theme Colors
```css
/* Dark theme optimized for gaming environments */
--color-dark-50: #18181b;     /* Page background dark */
--color-dark-100: #27272a;    /* Card background dark */
--color-dark-200: #3f3f46;    /* Border dark */
--color-dark-300: #52525b;    /* Border light dark */
--color-dark-400: #71717a;    /* Text muted dark */
--color-dark-500: #a1a1aa;    /* Text secondary dark */
--color-dark-600: #d4d4d8;    /* Text primary dark */
--color-dark-700: #e4e4e7;    /* Text heading dark */
--color-dark-800: #f4f4f5;    /* Text display dark */
--color-dark-900: #fafafa;    /* Maximum contrast dark */
```

#### Special Gaming Colors
```css
/* Gaming accent colors for specific features */
--color-gaming-blue: #1e40af;     /* DM tools */
--color-gaming-purple: #7c3aed;   /* AI features */
--color-gaming-teal: #0d9488;     /* Active session */
--color-gaming-orange: #ea580c;   /* Notifications */
--color-gaming-gold: #ca8a04;     /* Premium features */
```

---

## Typography System

### Font Families
```css
/* Primary font stack - optimized for readability */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
                'Helvetica Neue', Arial, sans-serif;

/* Monospace for code and data */
--font-mono: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 
             'Cascadia Code', monospace;

/* Display font for headings (optional accent) */
--font-display: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
```

### Font Sizes and Line Heights
```css
/* Display - For major headings and panic button */
--text-display-2xl: 4.5rem;    /* 72px */
--text-display-xl: 3.75rem;    /* 60px */
--text-display-lg: 3rem;       /* 48px */
--text-display-md: 2.25rem;    /* 36px */
--text-display-sm: 1.875rem;   /* 30px */

/* Headline - For page titles and major sections */
--text-headline-xl: 1.5rem;    /* 24px */
--text-headline-lg: 1.25rem;   /* 20px */
--text-headline-md: 1.125rem;  /* 18px */

/* Title - For card titles and form labels */
--text-title-lg: 1rem;         /* 16px */
--text-title-md: 0.875rem;     /* 14px */
--text-title-sm: 0.75rem;      /* 12px */

/* Body - For content and descriptions */
--text-body-lg: 1rem;          /* 16px */
--text-body-md: 0.875rem;      /* 14px */
--text-body-sm: 0.75rem;       /* 12px */

/* Caption - For metadata and fine print */
--text-caption-lg: 0.75rem;    /* 12px */
--text-caption-md: 0.6875rem;  /* 11px */
--text-caption-sm: 0.625rem;   /* 10px */

/* Line Heights */
--leading-none: 1;
--leading-tight: 1.25;
--leading-snug: 1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose: 2;
```

### Font Weights
```css
--font-weight-thin: 100;
--font-weight-light: 300;
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
--font-weight-extrabold: 800;
--font-weight-black: 900;
```

### Typography Usage Rules
```css
/* Panic Button Text */
.panic-button-text {
  font-size: var(--text-display-md);
  font-weight: var(--font-weight-bold);
  line-height: var(--leading-tight);
  letter-spacing: -0.025em;
}

/* Page Headings */
.page-heading {
  font-size: var(--text-headline-xl);
  font-weight: var(--font-weight-semibold);
  line-height: var(--leading-tight);
  color: var(--color-neutral-800);
}

/* Card Titles */
.card-title {
  font-size: var(--text-title-lg);
  font-weight: var(--font-weight-medium);
  line-height: var(--leading-snug);
  color: var(--color-neutral-700);
}

/* Body Text */
.body-text {
  font-size: var(--text-body-md);
  font-weight: var(--font-weight-normal);
  line-height: var(--leading-normal);
  color: var(--color-neutral-600);
}

/* Muted Text */
.muted-text {
  font-size: var(--text-body-sm);
  font-weight: var(--font-weight-normal);
  line-height: var(--leading-normal);
  color: var(--color-neutral-400);
}
```

---

## Spacing System

### Base Spacing Scale (8px grid)
```css
--space-px: 1px;
--space-0: 0;
--space-0-5: 0.125rem;  /* 2px */
--space-1: 0.25rem;     /* 4px */
--space-1-5: 0.375rem;  /* 6px */
--space-2: 0.5rem;      /* 8px */
--space-2-5: 0.625rem;  /* 10px */
--space-3: 0.75rem;     /* 12px */
--space-3-5: 0.875rem;  /* 14px */
--space-4: 1rem;        /* 16px */
--space-5: 1.25rem;     /* 20px */
--space-6: 1.5rem;      /* 24px */
--space-7: 1.75rem;     /* 28px */
--space-8: 2rem;        /* 32px */
--space-9: 2.25rem;     /* 36px */
--space-10: 2.5rem;     /* 40px */
--space-11: 2.75rem;    /* 44px */
--space-12: 3rem;       /* 48px */
--space-14: 3.5rem;     /* 56px */
--space-16: 4rem;       /* 64px */
--space-20: 5rem;       /* 80px */
--space-24: 6rem;       /* 96px */
--space-28: 7rem;       /* 112px */
--space-32: 8rem;       /* 128px */
```

### Component Spacing Rules
```css
/* Card spacing */
--card-padding: var(--space-6);
--card-gap: var(--space-6);

/* Button spacing */
--button-padding-x: var(--space-4);
--button-padding-y: var(--space-2-5);
--button-gap: var(--space-3);

/* Form spacing */
--form-gap: var(--space-4);
--field-gap: var(--space-3);

/* Navigation spacing */
--nav-padding: var(--space-6);
--nav-gap: var(--space-8);

/* Content spacing */
--content-gap: var(--space-8);
--section-gap: var(--space-12);
```

---

## Border Radius System

```css
--radius-none: 0;
--radius-sm: 0.125rem;   /* 2px */
--radius-base: 0.25rem;  /* 4px */
--radius-md: 0.375rem;   /* 6px */
--radius-lg: 0.5rem;     /* 8px */
--radius-xl: 0.75rem;    /* 12px */
--radius-2xl: 1rem;      /* 16px */
--radius-3xl: 1.5rem;    /* 24px */
--radius-full: 9999px;   /* Circle */

/* Component-specific radius */
--radius-button: var(--radius-lg);
--radius-card: var(--radius-xl);
--radius-input: var(--radius-md);
--radius-panic-button: var(--radius-full);
```

---

## Shadow System

### Light Theme Shadows
```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-base: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
--shadow-inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);

/* Colored shadows for interactive elements */
--shadow-primary: 0 4px 14px 0 rgb(99 102 241 / 0.15);
--shadow-panic: 0 4px 14px 0 rgb(220 38 38 / 0.25);
--shadow-success: 0 4px 14px 0 rgb(34 197 94 / 0.15);
```

### Dark Theme Shadows
```css
--shadow-dark-sm: 0 1px 2px 0 rgb(0 0 0 / 0.3);
--shadow-dark-base: 0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4);
--shadow-dark-md: 0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4);
--shadow-dark-lg: 0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4);
--shadow-dark-xl: 0 20px 25px -5px rgb(0 0 0 / 0.4), 0 8px 10px -6px rgb(0 0 0 / 0.4);
--shadow-dark-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.6);
```

---

## Component Themes

### Buttons

#### Primary Button
```css
.button-primary {
  background-color: var(--color-primary-600);
  color: white;
  border: none;
  border-radius: var(--radius-button);
  padding: var(--button-padding-y) var(--button-padding-x);
  font-weight: var(--font-weight-medium);
  box-shadow: var(--shadow-sm);
  transition: all 150ms ease-in-out;
}

.button-primary:hover {
  background-color: var(--color-primary-700);
  box-shadow: var(--shadow-primary);
  transform: translateY(-1px);
}

.button-primary:active {
  background-color: var(--color-primary-800);
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}
```

#### Panic Button
```css
.panic-button {
  background: linear-gradient(135deg, var(--color-panic-500), var(--color-panic-600));
  color: white;
  border: none;
  border-radius: var(--radius-panic-button);
  width: 80px;
  height: 80px;
  font-size: var(--text-title-lg);
  font-weight: var(--font-weight-bold);
  box-shadow: var(--shadow-panic);
  transition: all 200ms ease-in-out;
  position: relative;
  overflow: hidden;
}

.panic-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 200ms ease-in-out;
}

.panic-button:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 20px 0 rgb(220 38 38 / 0.35);
}

.panic-button:hover::before {
  opacity: 1;
}

.panic-button:active {
  transform: scale(0.98);
}

/* Pulse animation for processing state */
.panic-button.processing {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
```

#### Secondary Button
```css
.button-secondary {
  background-color: var(--color-neutral-100);
  color: var(--color-neutral-700);
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-button);
  padding: var(--button-padding-y) var(--button-padding-x);
  font-weight: var(--font-weight-medium);
  transition: all 150ms ease-in-out;
}

.button-secondary:hover {
  background-color: var(--color-neutral-50);
  border-color: var(--color-neutral-300);
  box-shadow: var(--shadow-sm);
}
```

### Cards

#### Base Card
```css
.card {
  background-color: var(--color-neutral-100);
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-card);
  padding: var(--card-padding);
  box-shadow: var(--shadow-sm);
  transition: all 200ms ease-in-out;
}

.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.card-interactive {
  cursor: pointer;
}

.card-interactive:hover {
  border-color: var(--color-primary-200);
  box-shadow: var(--shadow-lg);
}
```

#### Campaign Card
```css
.campaign-card {
  position: relative;
  background: linear-gradient(135deg, var(--color-neutral-50), var(--color-neutral-100));
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-card);
  padding: var(--space-6);
  overflow: hidden;
}

.campaign-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(to bottom, var(--color-primary-500), var(--color-secondary-500));
}

.campaign-card-title {
  font-size: var(--text-headline-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-neutral-800);
  margin-bottom: var(--space-2);
}

.campaign-card-description {
  font-size: var(--text-body-md);
  color: var(--color-neutral-600);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-4);
}

.campaign-card-meta {
  font-size: var(--text-caption-lg);
  color: var(--color-neutral-400);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

### Forms

#### Input Fields
```css
.input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-neutral-300);
  border-radius: var(--radius-input);
  font-size: var(--text-body-md);
  color: var(--color-neutral-700);
  background-color: var(--color-neutral-50);
  transition: all 150ms ease-in-out;
}

.input:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgb(99 102 241 / 0.1);
  background-color: white;
}

.input::placeholder {
  color: var(--color-neutral-400);
}

.input:disabled {
  background-color: var(--color-neutral-100);
  color: var(--color-neutral-400);
  cursor: not-allowed;
}
```

#### File Upload Zone
```css
.file-upload-zone {
  border: 2px dashed var(--color-neutral-300);
  border-radius: var(--radius-xl);
  padding: var(--space-12);
  text-align: center;
  background-color: var(--color-neutral-50);
  transition: all 200ms ease-in-out;
  cursor: pointer;
}

.file-upload-zone:hover {
  border-color: var(--color-primary-400);
  background-color: rgb(99 102 241 / 0.02);
}

.file-upload-zone.drag-over {
  border-color: var(--color-primary-500);
  background-color: rgb(99 102 241 / 0.05);
  transform: scale(1.02);
}

.file-upload-icon {
  width: 48px;
  height: 48px;
  color: var(--color-neutral-400);
  margin: 0 auto var(--space-4);
}

.file-upload-text {
  font-size: var(--text-body-lg);
  color: var(--color-neutral-600);
  margin-bottom: var(--space-2);
}

.file-upload-hint {
  font-size: var(--text-body-sm);
  color: var(--color-neutral-400);
}
```

---

## Radial Interface Theme

### Radial Menu Container
```css
.radial-menu {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, 
    var(--color-neutral-50) 0%, 
    var(--color-neutral-100) 50%, 
    var(--color-neutral-200) 100%);
  box-shadow: var(--shadow-2xl);
  z-index: 1000;
}

.radial-menu-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgb(0 0 0 / 0.5);
  backdrop-filter: blur(4px);
  z-index: 999;
}
```

### Radial Menu Segments
```css
.radial-segment {
  position: absolute;
  width: 50%;
  height: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  transition: all 200ms ease-in-out;
  border-radius: 0;
  overflow: hidden;
}

.radial-segment::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, transparent 0%, rgba(99, 102, 241, 0.1) 100%);
  opacity: 0;
  transition: opacity 200ms ease-in-out;
}

.radial-segment:hover::before {
  opacity: 1;
}

.radial-segment:hover {
  transform: scale(1.05);
  z-index: 2;
}

/* Individual segment positioning */
.radial-segment.npc {
  top: 0;
  left: 50%;
  transform-origin: bottom left;
  clip-path: polygon(0 0, 100% 0, 0 100%);
}

.radial-segment.encounter {
  top: 0;
  right: 0;
  transform-origin: bottom left;
  clip-path: polygon(0 0, 100% 0, 100% 100%);
}

.radial-segment.redirect {
  bottom: 0;
  right: 0;
  transform-origin: top left;
  clip-path: polygon(100% 0, 100% 100%, 0 100%);
}

.radial-segment.flavor {
  bottom: 0;
  left: 0;
  transform-origin: top right;
  clip-path: polygon(0 0, 100% 100%, 0 100%);
}

.radial-segment.foreshadow {
  top: 50%;
  left: 0;
  transform-origin: center right;
  clip-path: polygon(0 0, 100% 50%, 0 100%);
}
```

---

## Dark Theme Overrides

```css
[data-theme="dark"] {
  /* Background colors */
  --color-background: var(--color-dark-50);
  --color-surface: var(--color-dark-100);
  --color-border: var(--color-dark-200);
  
  /* Text colors */
  --color-text-primary: var(--color-dark-600);
  --color-text-secondary: var(--color-dark-500);
  --color-text-muted: var(--color-dark-400);
  --color-text-heading: var(--color-dark-700);
  
  /* Shadows */
  --shadow-sm: var(--shadow-dark-sm);
  --shadow-base: var(--shadow-dark-base);
  --shadow-md: var(--shadow-dark-md);
  --shadow-lg: var(--shadow-dark-lg);
  --shadow-xl: var(--shadow-dark-xl);
  --shadow-2xl: var(--shadow-dark-2xl);
}

/* Dark theme card adjustments */
[data-theme="dark"] .card {
  background-color: var(--color-dark-100);
  border-color: var(--color-dark-200);
}

[data-theme="dark"] .input {
  background-color: var(--color-dark-100);
  border-color: var(--color-dark-200);
  color: var(--color-dark-600);
}

[data-theme="dark"] .file-upload-zone {
  background-color: var(--color-dark-100);
  border-color: var(--color-dark-200);
}
```

---

## Gaming-Specific Elements

### Status Indicators
```css
.status-active {
  background-color: var(--color-gaming-teal);
  color: white;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--text-caption-lg);
  font-weight: var(--font-weight-medium);
}

.status-preparing {
  background-color: var(--color-warning-100);
  color: var(--color-warning-700);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--text-caption-lg);
  font-weight: var(--font-weight-medium);
}

.status-completed {
  background-color: var(--color-success-100);
  color: var(--color-success-700);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--text-caption-lg);
  font-weight: var(--font-weight-medium);
}
```

### AI Content Indicators
```css
.ai-content-badge {
  background: linear-gradient(135deg, var(--color-gaming-purple), var(--color-secondary-600));
  color: white;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-base);
  font-size: var(--text-caption-md);
  font-weight: var(--font-weight-medium);
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
}

.ai-content-container {
  border-left: 3px solid var(--color-gaming-purple);
  padding-left: var(--space-4);
  background-color: rgb(124 58 237 / 0.02);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
}
```

---

## Responsive Adjustments

### Mobile Overrides
```css
@media (max-width: 768px) {
  :root {
    /* Smaller spacing on mobile */
    --card-padding: var(--space-4);
    --nav-padding: var(--space-4);
    
    /* Larger touch targets */
    --button-padding-y: var(--space-3);
    --button-padding-x: var(--space-5);
  }
  
  .panic-button {
    width: 64px;
    height: 64px;
    font-size: var(--text-title-md);
  }
  
  .radial-menu {
    width: 320px;
    height: 320px;
  }
}
```

### Large Screen Enhancements
```css
@media (min-width: 1440px) {
  :root {
    /* More generous spacing on large screens */
    --section-gap: var(--space-16);
    --card-gap: var(--space-8);
  }
  
  .panic-button {
    width: 96px;
    height: 96px;
    font-size: var(--text-headline-md);
  }
}
```

---

## Animation Themes

### Loading Animations
```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-25%); }
}

@keyframes skeleton {
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

.loading-pulse {
  animation: pulse 2s ease-in-out infinite;
}

.loading-skeleton {
  background: linear-gradient(90deg, var(--color-neutral-200) 0px, var(--color-neutral-100) 40px, var(--color-neutral-200) 80px);
  background-size: 200px 100%;
  animation: skeleton 1.2s ease-in-out infinite;
}
```

This comprehensive theme system provides all the visual design tokens and component styling needed to implement the Professional Gaming aesthetic consistently throughout the Improv Panic Button application. 