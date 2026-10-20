# The Founder's Circle

Site for The Founder's Circle and Build Night at UC Berkeley, live at [foundersquare.org](https://foundersquare.org).

A single static page: `index.html` with vendored [GSAP](https://gsap.com) 3.13 (ScrollTrigger, SplitText) and [Lenis](https://lenis.darkroom.engineering) in `vendor/`. No build step.

## Local preview

```bash
python3 -m http.server 8000
```

## Deploys

Pushes to `main` deploy to production on Vercel; other branches get preview URLs.
