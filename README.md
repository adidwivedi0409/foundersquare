# Founder Square

Site for Founder Square and Build Night at UC Berkeley, live at [foundersquare.org](https://foundersquare.org).

A single static page: `index.html` with vendored [GSAP](https://gsap.com) 3.13 (ScrollTrigger, SplitText) and [Lenis](https://lenis.darkroom.engineering) in `vendor/`. No build step.

## Brand

The logo, tokens, components and the identity, language, motion and imagery guides live in [`brand/`](brand/). Live previews: [Founder Square design system](https://claude.ai/artifact/1Tdh7sFEqkBQz2f3n5RFuE).

## Local preview

```bash
python3 -m http.server 8000
```

## Deploys

Pushes to `main` deploy to production on Vercel; other branches get preview URLs.
