import { resolve } from 'node:path';
import { LeadStore } from './store.mjs';
import { createApp } from './app.mjs';
import { validEmail } from '../shared/lead-schema.js';

const env = process.env;
const publicOrigin = env.PUBLIC_ORIGIN || 'http://localhost:3000';
const origin = new URL(publicOrigin);
if (
  !['http:', 'https:'].includes(origin.protocol) ||
  origin.origin !== publicOrigin ||
  origin.username ||
  origin.password
) {
  throw new Error('PUBLIC_ORIGIN must be an http(s) origin without path or trailing slash.');
}
if (
  env.NODE_ENV === 'production' &&
  (!env.PUBLIC_ORIGIN || !validEmail(env.CONTACT_EMAIL) || !env.BUSINESS_NAME?.trim())
) {
  throw new Error(
    'Set PUBLIC_ORIGIN, BUSINESS_NAME and CONTACT_EMAIL before accepting production enquiries.',
  );
}
if (
  env.NODE_ENV === 'production' &&
  origin.protocol !== 'https:' &&
  !['localhost', '127.0.0.1', '[::1]'].includes(origin.hostname)
) {
  throw new Error('Production requires an HTTPS public origin.');
}
const retentionDays = Number(env.LEAD_RETENTION_DAYS ?? 90);
const port = Number(env.PORT ?? 3001);
if (!Number.isInteger(retentionDays) || retentionDays < 1 || retentionDays > 365)
  throw new Error('LEAD_RETENTION_DAYS must be 1–365.');
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be 1–65535.');
const store = new LeadStore(resolve(env.LEADS_DB_PATH || 'data/leads.sqlite'), { retentionDays });
const app = createApp({
  store,
  publicOrigin,
  contactEmail: env.CONTACT_EMAIL ?? '',
  businessName: env.BUSINESS_NAME || 'AutoFlow',
  retentionDays,
  trustedProxyIps: (env.TRUSTED_PROXY_IPS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
});
const purgeTimer = setInterval(() => {
  try {
    store.purgeExpired();
  } catch {
    console.error('lead_retention_failed');
  }
}, 3600000).unref();
app.listen(port, env.HOST || '127.0.0.1', () =>
  console.info(`AutoFlow listening on port ${port}.`),
);
let stopping = false;
function stop() {
  if (stopping) return;
  stopping = true;
  clearInterval(purgeTimer);
  const deadline = setTimeout(() => app.closeAllConnections(), 5000).unref();
  app.close(() => {
    clearTimeout(deadline);
    store.close();
  });
}
process.on('SIGTERM', stop);
process.on('SIGINT', stop);
