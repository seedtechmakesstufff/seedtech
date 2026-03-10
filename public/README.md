# Public Directory

This directory contains static assets served at the root of the website.

## Structure

```
/public
  /images          → Site images (compressed, optimized)
  /icons           → Custom icons and SVGs
  favicon.ico      → Browser tab icon
  og-image.jpg     → Default Open Graph image (1200x630px)
  robots.txt       → Search engine crawl rules (if not using app/robots.ts)
```

## Image Guidelines

- Compress all images before adding (use TinyPNG, Squoosh, or similar)
- Use WebP format when possible for better performance
- Recommended sizes:
  - Hero images: 1920x1080px max
  - Card images: 800x600px
  - Thumbnails: 400x300px
  - OG image: 1200x630px
  - Favicon: 32x32px + 180x180px (Apple touch)

Place static assets here. Use `next/image` component to reference them in code.
