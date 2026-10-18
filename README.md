# LonghiDev portfolio demo

Responsive LonghiDev home with a capsule navigation, static headline, synchronized service label, and a non-interactive HyperFrames film showing three illustrative product concepts. The film loops every 9 seconds (about three seconds per service), using a laptop on desktop and vertical phone layouts below 640px. Only an accessible pause/resume control is exposed. Playback pauses offscreen, in hidden tabs, and for reduced-motion preferences. The contact form sends submissions through the server to the private Windmill intake. Names and interface data in the concepts are fictional.

Built with Astro, TypeScript, `@hyperframes/player`, GSAP, and the self-hosted Outfit Variable font. The composition lives in `src/pages/motion/[format].astro` with shared device markup in `src/components/HeroDevice.astro`. Runtime 0.8.171 is self-hosted in `public/vendor/hyperframes/` (MIT license included); playback needs no CDN.

## Development

- `npm install` — install dependencies
- `npm run dev -- --background` — start the local preview in background mode
- `npm run astro -- dev status` — check the server
- `npm run astro -- dev logs` — read server logs
- `npm run astro -- dev stop` — stop the server

## Checks and build

- `npm run check` — check Astro and TypeScript
- `npm run build` — build the site and standalone Node server
- `npm test` — run the contact boundary tests and built-page content check; run `npm run build` first

## Contact intake

The server exposes `POST /api/contact` and calls Windmill's synchronous `f/sales/receive_contact` endpoint. Set `CONTACT_INTAKE_URL` and `CONTACT_INTAKE_TOKEN` as server environment variables (see `.env.example`); never expose them with a `PUBLIC_` prefix. Without both values, the endpoint fails closed with HTTP 503. A successful response requires Windmill's committed receipt `{ "request_id": "<uuid>", "status": "RECEIVED" }`. The browser retains the same `event_id` through retries and only replaces it after that receipt.

The Node server listens on `0.0.0.0:8080`; `GET /api/health` is a dependency-free liveness check. Configure these runtime environment variables in the deployment secret/configuration, not in the image.

## Deployment

Pushing to `main` publishes `ghcr.io/lerma4/another-longhidev-website` and updates the GitOps overlay. Configure the `GITOPS_REPO_TOKEN` Actions secret with write access to `Lerma4/k3s-argocd-gitops`; keep the GHCR package public so the cluster can pull it.

Full Astro documentation: https://docs.astro.build
