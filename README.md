# Infinite Scroll With Parallax (Tutorial Project)

This project is a simple front-end tutorial demo showing how to build:

- Infinite vertical scrolling with Lenis
- Scroll-based parallax animations with GSAP + ScrollTrigger

## What You Need

- A modern browser (Chrome, Safari, Edge, or Firefox)
- Internet connection (the project loads GSAP and Lenis from CDNs)
- The project files in this repository

## Project Structure

- `index.html` - page markup and CDN script/style includes
- `styles.css` - component and layout styling
- `scripts.js` - Lenis, snapping, marquee, and GSAP animation logic
- `reset.css` - CSS reset
- `assets/` - tutorial images (`01.jpg`, `02.jpg`, `03.jpg`)

## How to Run Locally

This is a static project, so you can open `index.html` directly in your browser.

1. Open the project folder.
2. Double-click `index.html` (or drag it into your browser).
3. Refresh the browser whenever you make changes.

## Tutorial Notes

- The Lenis instance is configured with `infinite: true` and wraps the `.wrapper` element.
- ScrollTrigger is proxied to Lenis using `ScrollTrigger.scrollerProxy(...)`.
- Hero sections are duplicated once at the end to help create a seamless loop.
- Each `.hero` runs:
  - image parallax (`yPercent`)
  - marquee scale animation (`scale`)

## Common Issues

- If images do not appear, confirm files exist in `assets/` and paths match `index.html`.
- If scrolling/animation does not work, check browser console for blocked CDN requests.
- If styling looks wrong, verify both `reset.css` and `styles.css` are loading.
