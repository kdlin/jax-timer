# Design System Specification: High-End Minimalist Dark Mode

## 1. Overview & Creative North Star

### The Creative North Star: "The Obsidian HUD"
This design system is predicated on the concept of an **Obsidian HUD (Heads-Up Display)**. It rejects the traditional "web page" metaphor in favor of a sophisticated, high-performance interface where components appear as floating, monochromatic modules. Inspired by the surgical precision of Resend and the compact fluidity of modern media players, the system prioritizes "always-on-top" architecture.

We achieve a signature editorial feel by moving away from rigid grids and generic layouts. Instead, we use intentional asymmetry, varied typography scales, and layered transparency to create an environment that feels expensive, focused, and deeply utilitarian. 

---

## 2. Colors

The color palette is a study in tonal depth, using absolute blacks and shifting grays to create a sense of infinite space.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders for sectioning or layout containment. Structural separation must be achieved through background color shifts. For instance, a container using `surface-container-low` (#1b1b1b) should sit on a background of `surface` (#131313) to define its bounds.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers of polished stone and smoked glass.
- **Background (`#131313`):** The base canvas.
- **Surface-Container-Low (`#1b1b1b`):** Primary grouping areas.
- **Surface-Container-High (`#2a2a2a`):** Interactive elements or secondary popovers.
- **Surface-Container-Highest (`#353535`):** Tooltips and active states.

### The "Glass & Gradient" Rule
To evoke a premium, custom feel, use **Glassmorphism** for floating widgets. Apply a 20% opacity to `surface-container-highest` and pair it with a `backdrop-blur` of 12px to 20px. This allows the underlying UI to bleed through softly, grounding the floating element in the environment.

### Signature Textures
Main CTAs should leverage a subtle linear gradient from `primary` (#ffffff) to `primary-container` (#d4d4d4) at a 45-degree angle. This provides a "metallic" luster that distinguishes the element from flat, digital-native buttons.

---

## 3. Typography

The system utilizes **Inter** for its neutral, high-legibility character. The hierarchy is designed to feel editorial, using drastic scale shifts to guide the eye.

- **Display (3.5rem - 2.25rem):** Used for "hero" stats or high-impact branding. Set with `-0.02em` letter spacing for a tighter, more aggressive look.
- **Headline (2rem - 1.5rem):** For major section titles. High contrast (`primary` #ffffff) is mandatory.
- **Title (1.375rem - 1rem):** Used for component headers. These provide the immediate context.
- **Body (1rem - 0.75rem):** The core of the interface. Use `on-surface-variant` (#c6c6c6) for general reading to reduce eye strain, reserving `primary` for highlighted text.
- **Labels (0.75rem - 0.6875rem):** Used for badges (like the 'POST' indicator) and metadata. Always in uppercase with `0.05em` tracking.

---

## 4. Elevation & Depth

We eschew traditional shadows in favor of **Tonal Layering**.

### The Layering Principle
Hierarchy is defined by stacking. A card in `surface-container-low` should contain children in `surface-container` to create a natural "lift." The eye perceives the lighter shades as being closer to the user.

### Ambient Shadows
For floating widgets (like the Spotify-style player), use a hyper-diffused "Ambient Shadow":
- **Blur:** 40px - 60px
- **Opacity:** 6%
- **Color:** `surface-tint` (#c6c6c7)
- **Effect:** This mimics a soft glow rather than a harsh drop shadow.

### The "Ghost Border" Fallback
Where separation is strictly necessary for accessibility, use a **Ghost Border**:
- **Token:** `outline-variant` (#474747)
- **Opacity:** 15% - 20%
- **Result:** A border that is felt rather than seen. Never use 100% opaque outlines.

---

## 5. Components

### Buttons
- **Primary:** Solid `primary` (#ffffff) background, `on-primary` (#1a1c1c) text. Bold, sans-serif. Radius: `DEFAULT` (0.5rem).
- **Secondary:** Transparent background with a `Ghost Border`. Text: `primary`.
- **Tertiary:** No background or border. Text: `secondary` (#c8c6c5). Use for "Cancel" or "Back" actions.

### The "Resend" Badge
Used for status indicators.
- **Style:** `surface-container-highest` background, 1px `Ghost Border` at 20% opacity.
- **Text:** `tertiary` (#6bfdaf) for success/POST, `error` (#ffb4ab) for alerts. Small-caps.

### Floating HUD Widgets (The Spotify Player)
- **Container:** `surface-container-low` at 80% opacity with `backdrop-blur`.
- **Corner Radius:** `lg` (1rem) to feel friendly yet architectural.
- **Padding:** Tight, 12px - 16px to maintain a compact footprint.

### Input Fields
- **Base:** `surface-container-lowest` background. No border.
- **Focus:** Transition background to `surface-container-low` and add a 1px `outline` (#919191) at 30% opacity.
- **Text:** `on-surface` for input; `on-surface-variant` for placeholder.

### Lists & Cards
- **Rule:** Absolute prohibition of divider lines.
- **Separation:** Use `1.5rem` vertical spacing or alternate backgrounds between `surface-container-low` and `surface-container-lowest`.

---

## 6. Do's and Don'ts

### Do
- **Do** embrace negative space. If a layout feels crowded, increase padding rather than adding borders.
- **Do** use `tertiary` (#6bfdaf) sparingly as a "high-tech" accent color for data visualizations or success states.
- **Do** ensure that "floating" elements always have a backdrop-blur to maintain readability over varying backgrounds.

### Don't
- **Don't** use pure white text for long-form body copy; it causes "haloing" in dark mode. Use `on-surface-variant`.
- **Don't** use standard "Blue" for links. Use `primary` (white) with an underline or `tertiary` (green) for a more technical feel.
- **Don't** use sharp 90-degree corners. Everything must have a minimum radius of `sm` (0.25rem) to maintain the "molded obsidian" aesthetic.