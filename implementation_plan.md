# Implement Mega Menu Navigation

## Goal Description
The objective is to implement a rich "Mega Menu" dropdown for the desktop navigation, matching the design provided in the reference image. The mega menu will appear when hovering over jewelry categories (like Rings, Earrings, etc.) and will contain categorized links (By Popular Style, By Price Range, By Karat, Shop For) as well as featured image cards for "Our Exclusive Designs".

## Proposed Changes

### Configuration/Data
#### [NEW] `src/data/navigation.ts`
- Extract the navigation data from [Header.tsx](file:///c:/Users/ASUS/Downloads/glimmering-gems-main/src/components/Header.tsx) into a separate file.
- Define a structured data model that supports nested mega menus.
- Include static data for the columns: "By Popular Style" (Engagement, Bands, Antique, etc.), "By Price Range", "By Karat", and "Shop For".
- Add sample "Exclusive Designs" with placeholder images for the cards.

### Components
#### [NEW] `src/components/DesktopNav.tsx`
- Create a new component to render the desktop navigation.
- Implement hover handlers to show/hide the mega menu.
- Build the mega menu grid layout using Tailwind CSS.
- The layout will have 5 columns: Popular Style (spanning 2 columns internally), Price Range, Karat/Shop For, and the Exclusive Designs (spanning multiple columns).
- Add smooth entrance and exit animations using `framer-motion`.

#### [MODIFY] [src/components/Header.tsx](file:///c:/Users/ASUS/Downloads/glimmering-gems-main/src/components/Header.tsx)
- Remove the inline `navLinks` constant.
- Replace the existing `<nav className="hidden lg:flex ...">` section with the new `<DesktopNav />` component.
- Pass required state (like `isScrolled`) to adjust the styling seamlessly.

## Verification Plan

### Automated Tests
- No existing automated tests cover the header. The app uses Vite and starts with `npm run dev`.

### Manual Testing
1. Ensure the development server is running (`npm run dev`).
2. Open the browser and view the application.
3. Hover over navigation items like "Rings" or "Earrings".
4. Verify the mega menu slides/fades in smoothly.
5. Verify the layout matches the provided design (multiple columns of links with section headers, plus image cards on the right).
6. Verify hovering off the menu hides it properly.
7. Verify the header remains completely functional when scrolled.
