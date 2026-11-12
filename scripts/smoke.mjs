import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { once } from 'node:events';
import { resolve } from 'node:path';
import { LeadStore } from '../server/store.mjs';
import { createApp } from '../server/app.mjs';
import { emptyLead } from '../shared/lead-schema.js';
const store = new LeadStore(':memory:');
const origin = 'http://smoke.test';
const server = createApp({
  store,
  publicOrigin: origin,
  contactEmail: 'operator@example.test',
  distDir: resolve('dist'),
});
server.listen(0, '127.0.0.1');
await once(server, 'listening');
const base = `http://127.0.0.1:${server.address().port}`;
try {
  const page = await fetch(base + '/');
  assert.equal(page.status, 200);
  const html = await page.text();
  assert.match(html, /<div id="root"><\/div>/);
  const asset = html.match(/src="([^\"]+\.js)"/);
  assert.ok(asset, 'Built JS entry exists');
  const script = await fetch(base + asset[1]);
  assert.equal(script.status, 200);
  await script.text();
  const config = await (await fetch(base + '/api/config')).json();
  assert.equal(config.acceptingLeads, true);
  const lead = {
    ...emptyLead(),
    companyName: 'Synthetic smoke business',
    industry: 'Professional services',
    companySize: 'Just me',
    name: 'Test Buyer',
    email: 'smoke@example.test',
    currentChallenges: ['Lead capture'],
    workflow: 'Capture incoming website enquiries and prepare a reliable team handoff.',
    consent: true,
    submissionId: randomUUID(),
  };
  const post = () =>
    fetch(base + '/api/leads', {
      method: 'POST',
      headers: { Origin: origin, 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });
  const first = await post();
  assert.equal(first.status, 201);
  const firstBody = await first.json();
  assert.equal(firstBody.accepted, true);
  const retry = await post();
  assert.equal(retry.status, 200);
  const retryBody = await retry.json();
  assert.equal(retryBody.receipt.id, firstBody.receipt.id);
  assert.equal(store.list().length, 1);
  assert.equal((await fetch(base + '/data/leads.sqlite')).status, 404);
  assert.equal((await fetch(base + '/api/leads')).status, 405);
  assert.equal((await fetch(base + '/health')).status, 200);
  console.log(
    JSON.stringify({
      builtSite: true,
      assets: true,
      configuredIntake: true,
      storedReceipt: true,
      duplicateSafe: true,
      privateDatabase: true,
      health: true,
      syntheticDataOnly: true,
    }),
  );
} finally {
  server.closeAllConnections();
  await new Promise((resolveDone) => server.close(resolveDone));
  store.close();
}
