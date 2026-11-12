# Deployment and private operation

This is a single-instance, low-volume review candidate. No production hosting, container execution,
TLS/proxy configuration or backup/restore drill has been verified on a real deployment.

## Before real enquiries

Approve the actual business identity and monitored public contact, offer/prices, privacy notice,
legal/data responsibilities, hosting region and budget. Set a lead-review owner and schedule:
**no email notifications are sent automatically**. SQLite is not application-encrypted; secure the
host, accounts, disk, exports and backups. This is not a GDPR, Kenya DPA or PCI DSS certification.

Use Node 24, one persistent private local volume and a controlled HTTPS reverse proxy. Do not use
a static-only host or disposable serverless disk. Serve frontend and API on the same `PUBLIC_ORIGIN`.
Production startup requires `BUSINESS_NAME`, valid `CONTACT_EMAIL` and an HTTPS public origin,
except loopback testing. Read `.env.example` and the README; never commit `.env` or live data.

## Optional container recipe — verify before use

```sh
docker build -t autoflow-pilot .
docker volume create autoflow-data
docker run --name autoflow-pilot --env-file .env.production \
  -p 127.0.0.1:3001:3001 -v autoflow-data:/data autoflow-pilot
```

The recipe creates resources; review costs and settings before running it. The container uses a
non-root `node` user. Ensure its persistent volume is writable by UID 1000 and keep `HOST=0.0.0.0`
and `LEADS_DB_PATH=/data/leads.sqlite` inside the protected container network. Put public HTTPS in
front; do not expose the backend around the proxy. The healthcheck assumes container port 3001.

## Request and proxy limits

Five submission attempts per client per 15 minutes by default, 16 KiB body limit, allowlisted fields,
JSON-only same-origin writes and a honeypot are basic controls, not complete bot protection. Origin
headers are not authentication. Add appropriate edge controls before exposure. The in-memory limiter
resets on restart and is not shared across nodes. Clients behind an untrusted proxy share its bucket.
Trust only exact socket addresses of proxies you control, and ensure they overwrite forwarding headers.

## Operator, retention and backups

Only authorized host operators can list/export/delete leads. Verify requestors before disclosures or
deletions. CSV exports contain personal data despite formula/quote escaping; keep them out of public
web directories, logs and issues. An export is not a full database backup.

Active retention is configurable from 1–365 days (default 90). Expired rows are removed on startup,
writes, operator listing and hourly cleanup. A stopped process cannot run cleanup. Logical deletion
is not secure erasure: SQLite pages/WAL, exports, snapshots and backups may retain copies.

For a simple consistent backup, stop all writers cleanly during an agreed maintenance window and
copy the entire private data directory, including any WAL/SHM files, to restricted encrypted storage.
Do not copy a changing SQLite file alone. Restore to a separate test path, verify a synthetic receipt
and expiry/deletion handling, and define backup retention before accepting real data. Restoring an
old backup can reintroduce previously deleted records unless your procedure accounts for that.

## Launch acceptance

Verify live HTTPS, exact origin, persistent volume/restart recovery, synthetic submission and private
operator review, blocked source/database access, failed-write behavior, reverse-proxy error paths,
monitoring, manual keyboard/screen-reader behavior and backup restoration. `/health` checks a basic
database query, not lead delivery, backups or privacy readiness. Resolve browser CI before merging.
There is no payment processing, multi-tenant portal, AI model call or client-specific CRM connector.
