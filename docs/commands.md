## Dev

- `npm install` - standard setup entry point for Node-based local work.
- `npm start` - runs `server.js` locally at `http://localhost:3000`.
- `start-local-server.cmd` - Windows helper that changes to the repo root and runs `server.js` with `C:\Program Files\nodejs\node.exe`.

## Build

- `npm run build:cloudflare` - rebuilds `dist-cloudflare/` from the repo root assets and HTML.
- `node scripts/build-cloudflare.js` - the underlying build step used by `npm run build:cloudflare`.

## Deploy

- `npm run deploy:cloudflare` - builds the static output, then deploys `dist-cloudflare/` with Wrangler.
- `npx wrangler pages deploy dist-cloudflare` - the raw Cloudflare Pages deploy command wrapped by `npm run deploy:cloudflare`.

## Lint, format, and typecheck

- None configured - `package.json` does not define lint, format, test, or typecheck scripts.

## Utility

- `python scripts/colorgrade_video.py --input <video> --output <video>` - grades a video file with the OpenCV-based utility in `scripts/colorgrade_video.py`.
- `python scripts/colorgrade_video.py --input <video> --preview-dir <dir> --preview-only` - renders still preview comparisons without writing a graded output video.
