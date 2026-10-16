# LonghiDev portfolio demo

Responsive LonghiDev home with a capsule navigation on a light canvas, a static headline, a changing service label, and an interactive device showing three illustrative product concepts. Desktop uses a laptop; screens under 640px use a phone with vertically adapted, scrollable interfaces. The contact form validates and confirms locally without sending or storing submissions. The ecommerce cart only changes its local count. Names and interface data are fictional.

Built with Astro, TypeScript, and the self-hosted Outfit Variable font.

## Development

- `npm install` — install dependencies
- `npm run dev -- --background` — start the local preview in background mode
- `npm run astro -- dev status` — check the server
- `npm run astro -- dev logs` — read server logs
- `npm run astro -- dev stop` — stop the server

## Checks and build

- `npm run check` — check Astro and TypeScript
- `npm run build` — build the static site
- `npm test` — run the built-page content check; run `npm run build` first

## Deployment

Pushing to `main` publishes `ghcr.io/lerma4/another-longhidev-website` and updates the GitOps overlay. Configure the `GITOPS_REPO_TOKEN` Actions secret with write access to `Lerma4/k3s-argocd-gitops`; keep the GHCR package public so the cluster can pull it.

Full Astro documentation: https://docs.astro.build
