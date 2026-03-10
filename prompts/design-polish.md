# Design Polish Prompt

> Use this prompt after initial page generation to refine and polish the UI.

---

## Full Page Polish Prompt

```
Review and polish the following Next.js page for visual quality and consistency.

**Page:** [PAGE_NAME]
**File:** app/[page-path]/page.tsx

Please perform the following checks and improvements:

### Spacing & Layout
- [ ] Verify consistent section padding (use `py-section` tokens)
- [ ] Check that section backgrounds alternate (white → light → white)
- [ ] Ensure proper container widths for each section type
- [ ] Verify grid gaps are consistent (`gap-6` for cards, `gap-8` for sections)
- [ ] Check that section headers have `mb-12` bottom margin

### Typography
- [ ] Verify heading hierarchy (h1 → h2 → h3, never skip levels)
- [ ] Check that only one `<h1>` exists on the page
- [ ] Ensure headlines use `text-neutral-900` and body uses `text-neutral-600`
- [ ] Verify subheadline text has `max-w-2xl mx-auto` for proper line length
- [ ] Check font weights are limited to 2 per section

### Colors
- [ ] Verify the CTA section uses `background="primary"` or `background="dark"`
- [ ] Check that button colors follow the variant system
- [ ] Ensure sufficient contrast on all text (WCAG AA)
- [ ] Verify no pure black (#000) is used for text

### Responsive Design
- [ ] Test layout at mobile (375px), tablet (768px), and desktop (1280px)
- [ ] Verify grids collapse properly: 3-col → 2-col → 1-col
- [ ] Check that text remains readable on all screen sizes
- [ ] Ensure buttons are full-width on mobile (`w-full sm:w-auto`)
- [ ] Verify navigation works on mobile (hamburger menu)

### Components
- [ ] Check all section components accept and use their default props correctly
- [ ] Verify Card components have consistent padding and border radius
- [ ] Ensure Button hover and focus states are present
- [ ] Check that links use `next/link` and images use `next/image`

### Micro-interactions
- [ ] Add hover effects to interactive cards (`hover:-translate-y-1`)
- [ ] Ensure smooth transitions on all hover states (`transition-all duration-200`)
- [ ] Add `focus-ring` class to all interactive elements
- [ ] Consider adding `animate-fade-in` to above-the-fold content

### Content Quality
- [ ] Verify all placeholder text has been replaced with real copy
- [ ] Check that headlines are concise and benefit-focused
- [ ] Ensure CTAs have action-oriented labels ("Get Started" not "Click Here")
- [ ] Verify all images have proper `alt` text

Apply all improvements directly to the code. Explain any significant changes you make.
```

---

## Quick Polish Prompt

```
Quick polish pass on this component. Check:
1. Spacing consistency (use design tokens)
2. Color usage (use neutral/primary palette only)
3. Responsive breakpoints (mobile-first)
4. Typography hierarchy
5. Hover/focus states on interactive elements
6. Accessibility (semantic HTML, aria labels)

Apply fixes directly.
```

---

## Tips

- Run the polish prompt after every major page generation
- Focus on one page at a time for best results
- After polish, do a manual visual review in the browser
- Use Chrome DevTools responsive mode to check breakpoints
