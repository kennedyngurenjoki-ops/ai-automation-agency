import { createServer } from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';
import { isIP } from 'node:net';
import { validateLead, validEmail, isUuid, PRIVACY_VERSION } from '../shared/lead-schema.js';

const MAX_BODY = 16384;
function fail(status, message, errors) {
  const e = new Error(message);
  e.status = status;
  e.errors = errors;
  return e;
}
function json(res, status, data, headers = {}) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...headers,
  });
  res.end(JSON.stringify(data));
}
function readJson(req) {
  return new Promise((resolveBody, reject) => {
    let size = 0,
      done = false;
    const chunks = [];
    const rejectOnce = (e) => {
      if (!done) {
        done = true;
        reject(e);
      }
    };
    req.on('data', (chunk) => {
      if (done) return;
      size += chunk.length;
      if (size > MAX_BODY) {
        req.pause();
        rejectOnce(fail(413, 'Request is too large.'));
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      if (done) return;
      try {
        done = true;
        resolveBody(JSON.parse(Buffer.concat(chunks).toString('utf8')));
      } catch {
        reject(fail(400, 'Request must contain valid JSON.'));
      }
    });
    req.on('error', () => rejectOnce(fail(400, 'Request could not be read.')));
    req.on('aborted', () => rejectOnce(fail(400, 'Request was interrupted.')));
  });
}
export function createApp({
  store,
  publicOrigin = 'http://localhost:3000',
  contactEmail = '',
  businessName = 'AutoFlow',
  retentionDays = 90,
  distDir = resolve('dist'),
  rateLimit = 5,
  rateWindowMs = 900000,
  trustedProxyIps = [],
  now = () => Date.now(),
  reportError = () => console.error('lead_service_error'),
} = {}) {
  const buckets = new Map();
  const allowedOrigin = new URL(publicOrigin).origin;
  const acceptingLeads = validEmail(contactEmail);
  function limited(req) {
    const remote = req.socket.remoteAddress ?? 'unknown';
    let ip = remote;
    if (trustedProxyIps.includes(remote)) {
      const candidate = String(req.headers['x-forwarded-for'] ?? '')
        .split(',')
        .at(-1)
        .trim();
      if (isIP(candidate)) ip = candidate;
    }
    const time = now();
    for (const [key, b] of buckets) if (b.until <= time) buckets.delete(key);
    const bucket = buckets.get(ip) ?? { count: 0, until: time + rateWindowMs };
    if (!buckets.has(ip) && buckets.size >= 10000) return Math.ceil(rateWindowMs / 1000);
    bucket.count++;
    buckets.set(ip, bucket);
    return bucket.count > rateLimit ? Math.max(1, Math.ceil((bucket.until - time) / 1000)) : 0;
  }
  const server = createServer(async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; base-uri 'none'; object-src 'none'; frame-ancestors 'none'; form-action 'self'",
    );
    if (allowedOrigin.startsWith('https:'))
      res.setHeader('Strict-Transport-Security', 'max-age=15552000');
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://local.invalid').pathname);
      if (pathname === '/health' && req.method === 'GET') {
        if (!store.healthy()) throw fail(503, 'Service is unavailable.');
        return json(res, 200, { status: 'ok' });
      }
      if (pathname === '/api/config' && req.method === 'GET')
        return json(res, 200, {
          businessName,
          contactEmail: acceptingLeads ? contactEmail : null,
          retentionDays,
          privacyVersion: PRIVACY_VERSION,
          acceptingLeads,
        });
      if (pathname === '/api/leads') {
        if (req.method !== 'POST')
          return json(res, 405, { error: 'Use POST to submit a request.' }, { Allow: 'POST' });
        if (req.headers.origin !== allowedOrigin)
          throw fail(403, 'Submit this request from our website.');
        if (!acceptingLeads)
          throw fail(503, 'Requests are not enabled yet. Please try again after operator setup.');
        const retry = limited(req);
        if (retry)
          return json(
            res,
            429,
            { error: 'Too many attempts. Please wait before trying again.' },
            { 'Retry-After': String(retry) },
          );
        if (
          String(req.headers['content-type'] ?? '')
            .split(';')[0]
            .trim()
            .toLowerCase() !== 'application/json'
        )
          throw fail(415, 'Use application/json.');
        if (Number(req.headers['content-length'] ?? 0) > MAX_BODY)
          throw fail(413, 'Request is too large.');
        const input = await readJson(req);
        const result = validateLead(input);
        if (!isUuid(input?.submissionId))
          result.errors.submissionId = 'Reload the page before submitting.';
        if (Object.keys(result.errors).length)
          throw fail(422, 'Please check the highlighted fields.', result.errors);
        const saved = store.save(input.submissionId, result.data);
        return json(res, saved.created ? 201 : 200, { accepted: true, receipt: saved.receipt });
      }
      if (pathname.startsWith('/api/')) return json(res, 404, { error: 'Not found.' });
      if (!['GET', 'HEAD'].includes(req.method))
        return json(res, 405, { error: 'Method not allowed.' }, { Allow: 'GET, HEAD' });
      const pages = new Set(['/', '/onboarding', '/privacy']);
      const publicAsset =
        /^\/assets\/[a-zA-Z0-9_.-]+\.(js|css|svg|png|jpg|webp|woff2)$/u.test(pathname) ||
        ['/favicon.svg', '/robots.txt'].includes(pathname);
      if (!pages.has(pathname) && !publicAsset) return json(res, 404, { error: 'Not found.' });
      const root = await realpath(distDir);
      const file = await realpath(
        resolve(root, pages.has(pathname) ? 'index.html' : '.' + pathname),
      );
      if (!file.startsWith(root + sep) || !(await stat(file)).isFile())
        throw fail(404, 'Not found.');
      const bytes = await readFile(file);
      const types = {
        '.html': 'text/html; charset=utf-8',
        '.js': 'text/javascript; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.svg': 'image/svg+xml',
        '.txt': 'text/plain; charset=utf-8',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.webp': 'image/webp',
        '.woff2': 'font/woff2',
      };
      res.writeHead(200, {
        'Content-Type': types[extname(file)] ?? 'application/octet-stream',
        'Content-Length': bytes.length,
        'Cache-Control': pathname.startsWith('/assets/')
          ? 'public, max-age=31536000, immutable'
          : 'no-cache',
      });
      res.end(req.method === 'HEAD' ? undefined : bytes);
    } catch (error) {
      let status = error.status ?? (['ENOENT', 'ENOTDIR'].includes(error.code) ? 404 : 503);
      if (error instanceof URIError) status = 400;
      if (status >= 500) reportError();
      if (res.headersSent || res.destroyed) return;
      if (status === 413) {
        res.setHeader('Connection', 'close');
        res.once('finish', () => req.destroy());
      }
      return json(res, status, {
        error:
          status >= 500
            ? 'We could not save your request. Please try again.'
            : status === 404
              ? 'Not found.'
              : error.message,
        ...(error.errors ? { errors: error.errors } : {}),
      });
    }
  });
  server.requestTimeout = 15000;
  server.headersTimeout = 10000;
  server.keepAliveTimeout = 5000;
  server.maxRequestsPerSocket = 100;
  return server;
}
