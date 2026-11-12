import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fixture, validLead } from './helpers.mjs';
test('health reports database availability without exposing customer data', async (t) => {
  const f = await fixture(t);
  const r = await fetch(f.base + '/health');
  assert.equal(r.status, 200);
  assert.deepEqual(await r.json(), { status: 'ok' });
});
test('configuration carries versioned privacy and retention without private settings', async (t) => {
  const f = await fixture(t);
  const c = await (await fetch(f.base + '/api/config')).json();
  assert.ok(c.privacyVersion);
  assert.equal(c.retentionDays, 90);
  assert.equal(c.databasePath, undefined);
});
test('unknown API paths return explicit JSON 404', async (t) => {
  const f = await fixture(t);
  const r = await fetch(f.base + '/api/unknown');
  assert.equal(r.status, 404);
  assert.match(r.headers.get('content-type'), /application\/json/);
});
test('public lead reads are disallowed', async (t) => {
  const f = await fixture(t);
  const r = await fetch(f.base + '/api/leads');
  assert.equal(r.status, 405);
  assert.equal(r.headers.get('allow'), 'POST');
});
test('unexpected lead write methods are disallowed', async (t) => {
  const f = await fixture(t);
  assert.equal((await fetch(f.base + '/api/leads', { method: 'PUT' })).status, 405);
});
test('operator setup must be valid even for otherwise valid input', async (t) => {
  const f = await fixture(t, { contactEmail: 'invalid' });
  assert.equal((await f.send()).status, 503);
  assert.equal(f.store.list().length, 0);
});
test('known public assets support HEAD and correct MIME', async (t) => {
  const dir = await mkdtemp(join(tmpdir(), 'intake-public-'));
  await writeFile(join(dir, 'favicon.svg'), '<svg xmlns="http://www.w3.org/2000/svg"/>');
  const f = await fixture(t, { distDir: dir });
  t.after(() => rm(dir, { recursive: true, force: true }));
  const r = await fetch(f.base + '/favicon.svg', { method: 'HEAD' });
  assert.equal(r.status, 200);
  assert.match(r.headers.get('content-type'), /image\/svg/);
  assert.equal(await r.text(), '');
});
test('only explicitly trusted proxies can split rate buckets', async (t) => {
  const f = await fixture(t, { rateLimit: 1, trustedProxyIps: ['127.0.0.1'] });
  assert.equal(
    (await f.send(validLead(), { headers: { 'X-Forwarded-For': '203.0.113.1' } })).status,
    201,
  );
  assert.equal(
    (await f.send(validLead(), { headers: { 'X-Forwarded-For': '203.0.113.2' } })).status,
    201,
  );
  assert.equal(
    (await f.send(validLead(), { headers: { 'X-Forwarded-For': '203.0.113.1' } })).status,
    429,
  );
});
test('stale privacy consent is rejected by the HTTP API', async (t) => {
  const f = await fixture(t);
  const r = await f.send(validLead({ privacyVersion: 'old' }));
  assert.equal(r.status, 422);
  assert.ok((await r.json()).errors.privacyVersion);
});
test('unknown client fields cannot become stored privileges', async (t) => {
  const f = await fixture(t);
  assert.equal((await f.send(validLead({ admin: true, privateToken: 'synthetic' }))).status, 201);
  const saved = f.store.list()[0];
  assert.equal(saved.admin, undefined);
  assert.equal(saved.privateToken, undefined);
  assert.equal(saved.consent, true);
});
