# Steven Changcherta — Portfolio

An Astro and TypeScript portfolio inspired by the [Adrian Murphy Webflow template by WebDev For You](https://webflow.com/made-in-webflow/website/webdev-for-you-adrian-murphy-template), with a deep-sea color palette and Steven's own content and images.

## Local development

```sh
npm install
npm run dev
```

Open http://127.0.0.1:4321. Validate with `npm run check` and `npm run build`.

## Editing

- `src/data/projects.ts`: project descriptions, links, dates, and gallery assets.
- `src/pages/index.astro`: introduction, education, contact, and page structure.
- `src/styles/global.css`: visual design and responsive styles.
- `public/images`: supplied images used on the website.
- `public/Steven-Changcherta-CV.pdf`: original supplied CV download.

CatatStock and Gesture Controlled Mouse dates are February–June 2026. Expected graduation is 2028; internship availability dates are intentionally omitted. Project results are self-reported from the supplied portfolio/CV. Gesture images are shown without the inconsistent left/right-click captions from the source PDF.

The supplied CV is unchanged and contains its original education wording. Update that PDF separately if its wording needs to match the website. The portrait is the original low-resolution supplied image; replace it with a higher-resolution PNG using the same filename when available.

## Vercel later

Import this repository into Vercel, choose Astro, build with `npm run build`, and use `dist` as output. No adapter is required for this static site. If importing a parent directory instead of this repository, set the root to the folder containing `package.json`. Nothing has been deployed.

Fonts load from Google Fonts with local system fallbacks. Images and the CV are served locally. Email contact opens the visitor's email application; no form service is required.
