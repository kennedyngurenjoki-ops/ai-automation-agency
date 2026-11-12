# AutoFlow — customer-intake automation pilot

A small-business automation-service website with a working, consent-based intake backend.
This is a **review candidate**, not a launched SaaS, passive-income system or guarantee of earnings.

## Included

- Responsive offer page and an explicitly hypothetical capacity-value calculator.
- Four-step form with shared browser/server validation and privacy consent.
- SQLite persistence with a receipt only after storage succeeds, and duplicate-safe retries.
- Same-origin JSON API, request-size limits, basic rate limiting, a honeypot and security headers.
- Private operator CLI to review requests, export spreadsheet-safe CSV or delete a selected receipt.
- Configurable retention, private runtime files, tests, CI and a non-root container recipe.

There are **no automatic emails, CRM writes, payments, AI calls or marketing subscriptions**.
The operator must check the private queue and respond through a separately approved process.

## Requirements and local setup

Use Node.js **24.x**, npm and a persistent private local disk. SQLite is built into Node.

```sh
npm ci --ignore-scripts
cp .env.example .env
npm run dev
```

Open `http://localhost:3000`. Vite proxies `/api` to port 3001. The default is preview-only:
set your real, approved `BUSINESS_NAME` and public `CONTACT_EMAIL` before accepting genuine enquiries.
Use synthetic data while testing. Never put an API key or password into a public contact setting.

## Check the implementation

```sh
npm run format:check
npm test
npm run build
npm run test:smoke
npx playwright install --with-deps chromium
npm run test:e2e
npm audit
```

See [verification](docs/VERIFICATION.md) for actual results and unresolved browser verification.
The smoke and browser tests use synthetic data and never send a real email or payment.

## Production model

```sh
npm ci --ignore-scripts
npm run build
# Set .env to the approved production settings first.
NODE_ENV=production npm start
```

Run one long-lived Node process behind a controlled HTTPS reverse proxy, with a private persistent
database volume. The same process serves the built frontend and API. **Uploading only `dist/` to
static hosting or using an ephemeral serverless disk is not a complete deployment.**
`npm run preview` previews static assets, not the intake backend.

| Variable              | Purpose                                                                                                                         |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `PUBLIC_ORIGIN`       | Exact browser origin, no path or trailing slash. Local development: `http://localhost:3000`; production: approved HTTPS domain. |
| `BUSINESS_NAME`       | Approved public business/operator identity. Required in production.                                                             |
| `CONTACT_EMAIL`       | Monitored public contact for enquiries and data requests. Required before intake is enabled.                                    |
| `HOST`, `PORT`        | Bind address and port; default `127.0.0.1:3001`. Containers bind `0.0.0.0` on their protected network.                          |
| `LEADS_DB_PATH`       | File on a private persistent volume; default `data/leads.sqlite`.                                                               |
| `LEAD_RETENTION_DAYS` | Active-database retention from 1–365 days; default 90.                                                                          |
| `TRUSTED_PROXY_IPS`   | Exact socket addresses of reverse proxies you control; otherwise empty.                                                         |

## Operate the private queue

Run on the trusted host with the same environment and database path as the service:

```sh
npm run leads -- list
npm run --silent leads -- export > /your-private-directory/requests.csv
# Verify the requestor and receipt before an intentional deletion:
npm run leads -- delete RECEIPT_UUID --confirm
```

Exports contain personal information. Do not commit them, serve them publicly or paste them into
issues. No public lead-listing endpoint exists. SQLite is not encrypted by this application;
protect the host, disk, backups and operator account. Review [deployment](docs/DEPLOYMENT.md) and
[security](docs/SECURITY.md) before accepting real data.

## Commercial next step

Use the [commercial plan](docs/COMMERCIAL_PLAN.md) to validate one narrowly scoped paid intake/handoff
pilot. Pricing is a hypothesis, not a published charge or forecast. Website polish does not prove
market demand. Client-specific integrations, support terms, identity/contact, hosting and costs
require owner approval before launch.

## License

MIT. The existing [LICENSE](LICENSE) and copyright notice are preserved.
