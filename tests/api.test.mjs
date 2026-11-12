import test from 'node:test';
import assert from 'node:assert/strict';
import { request } from 'node:http';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fixture, validLead } from './helpers.mjs';
test('real receipts follow storage; repeated submissions do not create duplicates', async (t) => {
  const f = await fixture(t);
  const data = validLead();
  const first = await f.send(data);
  assert.equal(first.status, 201);
  const a = await first.json();
  const second = await f.send(data);
  assert.equal(second.status, 200);
  const b = await second.json();
  assert.equal(a.accepted, true);
  assert.equal(a.receipt.id, b.receipt.id);
  assert.equal(f.store.list().length, 1);
});
test('invalid email and missing consent never reach storage', async (t) => {
  const f = await fixture(t);
  for (const extra of [{ email: 'bad' }, { consent: false }])
    assert.equal((await f.send(validLead(extra))).status, 422);
  assert.equal(f.store.list().length, 0);
});
test('missing or foreign origins are forbidden', async (t) => {
  const f = await fixture(t);
  assert.equal(
    (await f.send(validLead(), { headers: { Origin: 'https://foreign.test' } })).status,
    403,
  );
  assert.equal(
    (
      await fetch(f.base + '/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validLead()),
      })
    ).status,
    403,
  );
});
test('unsupported media, malformed JSON and null bodies fail closed', async (t) => {
  const f = await fixture(t);
  assert.equal(
    (await f.send(validLead(), { headers: { 'Content-Type': 'text/plain' } })).status,
    415,
  );
  assert.equal((await f.send('{broken')).status, 400);
  assert.equal((await f.send(null)).status, 422);
  assert.equal(f.store.list().length, 0);
});
test('oversized fixed-length request is bounded', async (t) => {
  const f = await fixture(t);
  assert.equal((await f.send('x'.repeat(20000))).status, 413);
  assert.equal(f.store.list().length, 0);
});
test('oversized chunked request returns 413, not success', async (t) => {
  const f = await fixture(t);
  const status = await new Promise((resolve, reject) => {
    const req = request(
      f.base + '/api/leads',
      {
        method: 'POST',
        headers: {
          Origin: 'http://client.test',
          'Content-Type': 'application/json',
          'Transfer-Encoding': 'chunked',
        },
      },
      (res) => {
        res.resume();
        res.on('end', () => resolve(res.statusCode));
      },
    );
    req.on('error', reject);
    req.write('x'.repeat(10000));
    req.end('x'.repeat(10000));
  });
  assert.equal(status, 413);
  assert.equal(f.store.list().length, 0);
});
test('rate limit rejects spoofed forwarding headers and returns retry guidance', async (t) => {
  const f = await fixture(t, { rateLimit: 1 });
  assert.equal(
    (await f.send(validLead(), { headers: { 'X-Forwarded-For': '203.0.113.1' } })).status,
    201,
  );
  const blocked = await f.send(validLead(), { headers: { 'X-Forwarded-For': '203.0.113.2' } });
  assert.equal(blocked.status, 429);
  assert.ok(Number(blocked.headers.get('retry-after')) > 0);
});
test('store failure cannot produce a success receipt or leak internals', async (t) => {
  let reported = 0;
  const f = await fixture(t, {
    store: {
      save() {
        throw Error('private storage detail');
      },
      healthy() {
        return true;
      },
    },
    reportError: () => reported++,
  });
  const response = await f.send();
  assert.equal(response.status, 503);
  const body = await response.json();
  assert.equal(body.accepted, undefined);
  assert.doesNotMatch(JSON.stringify(body), /private storage detail/);
  assert.equal(reported, 1);
});
test('operator configuration is public but lead listing is not', async (t) => {
  const f = await fixture(t);
  const config = await (await fetch(f.base + '/api/config')).json();
  assert.equal(config.contactEmail, 'operator@example.test');
  assert.equal(config.acceptingLeads, true);
  assert.equal((await fetch(f.base + '/api/leads')).status, 405);
  assert.equal((await fetch(f.base + '/api/admin/leads')).status, 404);
});
test('unset privacy contact blocks acceptance', async (t) => {
  const f = await fixture(t, { contactEmail: '' });
  assert.equal((await f.send()).status, 503);
  assert.equal(f.store.list().length, 0);
  assert.equal((await (await fetch(f.base + '/api/config')).json()).acceptingLeads, false);
});
test('production static routes set security headers and cannot expose data or source', async (t) => {
  const dir = await mkdtemp(join(tmpdir(), 'intake-static-'));
  await writeFile(join(dir, 'index.html'), '<html>synthetic page</html>');
  const f = await fixture(t, { distDir: dir });
  t.after(() => rm(dir, { recursive: true, force: true }));
  const response = await fetch(f.base + '/');
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.match(response.headers.get('content-security-policy'), /frame-ancestors 'none'/);
  for (const path of ['/.env', '/data/leads.sqlite', '/server/app.mjs', '/package.json'])
    assert.equal((await fetch(f.base + path)).status, 404);
});
