# Security boundaries

Implemented controls include server-side field/type/length/enum validation, consent version checks,
JSON/same-origin writes, bounded bodies, a honeypot, basic rate limiting, parameterized SQLite
statements, restricted file routes, security headers, stable retry keys and storage-confirmed receipts.
The private database has owner-only permissions and no public listing endpoint. Exports are escaped
for spreadsheet formulas/quotes, and individual deletion requires an explicit confirmation flag.
No request-body logging, marketing tracking or automatic LLM/email/CRM transfer is added.

These controls are not an independent security audit or compliance certification. Origin checks are
not authentication; the limiter is single-process/in-memory; contact ownership is not verified by
code. Protect the host and disk: SQLite is not application-encrypted. Do not collect credentials,
payment information, confidential customer records or sensitive personal data in this form.

Do not publish customer data or secrets in GitHub issues. Report vulnerabilities privately through
the deployed operator contact. If that contact is missing, intake must remain disabled. See
[deployment](DEPLOYMENT.md) for backup/retention/restore requirements. Never merge or deploy while
required CI, browser checks, hosting safeguards or owner approvals are outstanding.
