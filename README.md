# WinPeak Admin

Operations console for the WinPeak site: players, wallets, content, and affiliate partners.

## Local setup

1. Copy `.env.example` to `.env` and fill in values.
2. Use the same `DATABASE_URL` as the public site.
3. Install and run:

```bash
npm install
npm run dev
```

The app expects Node 22.12 or newer.

## Deploy

Set these on the host. Do not commit `.env`.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_BASE_URL` | Public URL of this admin app |
| `AUTH_URL` | Same URL as the admin app |
| `AUTH_SECRET` | Random secret for auth sessions |
| `DATABASE_URL` | Shared PostgreSQL URL |
| `ADMIN_EMAIL` | Staff login email |
| `ADMIN_PASSWORD` | Staff login password |
| `WINPEAK_SITE_URL` | Public player site origin |
| `WINPEAK_PUBLIC_ROOT` | Optional path to the public site so uploaded blog images are written there |

Build and start:

```bash
npm run build
npm start
```

Production notes:

- Keep the default branch as `master`. Use `dev` for staging if you want a preview.
- Prisma client is generated during `npm run build`.
- Blog image uploads write to disk. On serverless hosts that filesystem is not persistent, so set `WINPEAK_PUBLIC_ROOT` on a server with shared storage, or serve uploads from the public site.
- Unused Fuse demo pages and the public sign-up route are blocked.
