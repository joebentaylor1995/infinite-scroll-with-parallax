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


## Credits

- Images are owned by the client and are licensed only for use in this tutorial repository and its live GitHub demo. You may download the project and use the images locally for learning purposes only. Any other use, reproduction, redistribution, or commercial use outside this tutorial is strictly prohibited.


## Connect
**Joe Ben Taylor (this project author)**

- [Dribbble](https://dribbble.com/joebentaylor)
- [Website](https://joebentaylor.co.uk)
- [GitHub @joebentaylor1995](https://github.com/joebentaylor1995)
- [LinkedIn](https://www.linkedin.com/in/joebentaylor)

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

You are free to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software for any purpose, subject to the following conditions:

- **Images:** The images in the `assets/` directory are owned by the client and licensed **only for use in this tutorial repository and its live GitHub demo**.  
  **You may not redistribute, reproduce, or use the images for any other purpose.**

Copyright (c) Joe Ben Taylor