nimo-markdown-cv
================

<p align="center">
<img src="assets/README-63bf9.png" width="700">
</p>

A curriculum vitae template that lets you write your CV in Markdown and export to HTML/PDF.

## Getting started

1. Install Node.js 18+.
2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start dev server:

   ```bash
   pnpm dev
   ```

4. Open the printed-style CV preview (default): `http://localhost:5173`.

## Development

This repo works with `pnpm`, `npm`, or `yarn`. CI uses `pnpm` and the committed `pnpm-lock.yaml`, so `pnpm` is the recommended default.

Common command equivalents:

```bash
# install
pnpm install
npm install
yarn install

# dev server
pnpm dev
npm run dev
yarn dev

# production build
pnpm build
npm run build
yarn build

# local preview
pnpm preview
npm run preview
yarn preview
```


## Content source

- Edit your resume in `index.md`.
- Contact items are rendered directly from frontmatter metadata.

Supported contact fields:

```yaml
title: Your Name
homepage:
  url: https://example.com
  text: example.com
email:
  url: mailto:you@example.com
  text: you@example.com
phone: +1 (555) 555-5555
```

Use any subset of `homepage`, `email`, and `phone`; only provided fields are shown.

## PDF output

Use your browser print flow from the rendered page (`Cmd/Ctrl + P`).
Screen/print styles are served from `public/media/`.
