# Design Brief: Velora — Premium Dating App

## Aesthetic Direction
Luxury/refined. Premium dating platform combining Tinder's discovery flow with Raya's exclusivity and the visual sophistication of high-end jewelry brands. Deep charcoal backgrounds with warm gold accents, large rounded cards, smooth spring animations.

## Tone & Purpose
Velora positions dating as an intimate, premium experience. Every surface—from profile cards to buttons to micro-animations—conveys sophistication and exclusivity. Visual language is clean, intentional, and refined; no garish elements.

## Color Palette
| Token | Light OKLCH | Dark OKLCH | Use |
|:------|:-----------|:---------|:----|
| Primary | — | 0.68 0.2 50 | Gold accent buttons, interactive highlights, focus rings |
| Secondary | — | 0.65 0.2 48 | Bright gold for hover/active states, accent overlays |
| Background | 0.98 0 0 | 0.13 0 0 | Charcoal page background (#1A1A1A equiv.) |
| Card | 0.97 0 0 | 0.16 0 0 | Profile cards, elevated surfaces |
| Foreground | 0.2 0 0 | 0.93 0 0 | Body text, labels |
| Muted | 0.88 0 0 | 0.22 0 0 | Secondary text, disabled states, subtle borders |
| Destructive | 0.55 0.22 25 | 0.65 0.19 22 | Pass/reject actions, warnings |

## Typography
**Display**: GeneralSans (24px–48px, weights 400–700). Headings, profile names, hero text. Geometric, premium, contemporary.  
**Body**: DM Sans (14px–16px, weights 400–500). Form labels, descriptions, body copy. Clean, accessible, refined.  
**Mono**: Geist Mono (12px–14px). Code, timestamps, metadata. Consistent with tech-forward premium brand.

## Structural Zones

| Zone | Treatment | Radius | Shadow |
|:-----|:----------|:-------|:-------|
| Header | Card bg (0.16 0 0), border-b, padding 1rem | 0 | card |
| Profile Cards | Card bg, gold border accent, overflow hidden | 1.5rem | elevated |
| Action Buttons | Primary bg (gold), full width, interactive gold | 1.5rem | gold |
| Form Inputs | Muted bg, clear focus ring (gold), border subtle | 0.75rem | — |
| Footer | Muted bg (0.22 0 0), border-t | 0 | — |
| Popover/Modal | Popover bg (0.19 0 0), card radius | 1.5rem | elevated |

## Spacing & Rhythm
**Grid**: 8px base unit. Cards: 1.5rem (24px) internal padding. Profile discovery: 1rem gap between cards.  
**Breathing room**: Large horizontal margins (1.5rem–2rem) on mobile, (2rem–3rem) desktop. Vertical spacing between sections: 2rem–3rem.

## Component Patterns
- **Profile Cards**: Large rounded (24px), gradient overlay (gold fade), card shadow, tap-to-interact affordance.
- **Action Buttons**: Full-width, gold background, gold hover glow shadow, smooth scale on press (0.98x).
- **Form Inputs**: Subtle muted border, focus ring gold (spread 2px), clear placeholder text.
- **Navigation**: Minimalist header with logo, subtle bottom tab bar or side nav with muted separators.
- **Matches List**: Stack of small cards (reduced size) with preview image, name, last message. Hover brightens card bg.

## Motion & Animation
**Entrance**: Slide-up + fade-in (0.4s ease-out) for cards, modals, lists.  
**Interaction**: Gold glow pulse (2s infinite) on action buttons. Scale feedback (0.98x) on button press.  
**Swipe feedback**: Smooth card exit (fade, slight rotate). New card entrance with spring ease.  
**Transition default**: 0.3s cubic-bezier(0.4, 0, 0.2, 1) for all state changes (hover, active, disabled).

## Constraints & Guardrails
- **No defaults**: No system fonts, no flat UI, no generic shadows. Every surface has intentional depth.
- **Gold sparingly**: Primary accent on CTAs, focus rings, overlay gradients. Not on body text or backgrounds.
- **Photo overlays**: Only gradient overlays on images. No solid color blocks or badges over photos.
- **Radius consistency**: 24px (1.5rem) for cards and major components. 12px (0.75rem) for inputs. 8px (0.5rem) for small controls.
- **Typography hierarchy**: Display font only for headings (16px+). Body font for all micro-copy, labels, descriptions.
- **Dark mode only**: Velora ships dark. No light mode toggle. Premium experience optimized for evening use.

## Signature Detail
**Gradient photo overlays with gold gradient fade** (top-to-bottom, 40% opacity). Creates premium, editorial feel. Combined with card shadow and rounded corners, each profile is a distinct, tactile object.

## Exports & Customizations
- **index.css**: OKLCH palette (charcoal + gold), font declarations (GeneralSans, DM Sans, Geist Mono), gradient utilities (`.gradient-gold`, `.gradient-overlay-gold`), shadow utilities (`.shadow-card`, `.shadow-elevated`).
- **tailwind.config.js**: `boxShadow` custom (card, elevated, gold), `keyframes` (slide-up, fade-in, pulse-gold), `animation` entries, `borderRadius` 24px primary (1.5rem).

