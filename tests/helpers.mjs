import { randomUUID } from 'node:crypto';
import { once } from 'node:events';
import { emptyLead } from '../shared/lead-schema.js';
import { LeadStore } from '../server/store.mjs';
import { createApp } from '../server/app.mjs';
export function validLead(extra = {}) {
  return {
    ...emptyLead(),
    companyName: 'Sample Services',
    industry: 'Professional services',
    companySize: '2–10 people',
    name: 'Test Buyer',
    email: 'buyer@example.test',
    currentChallenges: ['Lead capture'],
    workflow: 'Collect website enquiries and prepare a clear handoff for our team.',
    consent: true,
    submissionId: randomUUID(),
    ...extra,
  };
}
export async function fixture(t, options = {}) {
  const store = options.store ?? new LeadStore(':memory:');
  const app = createApp({
    store,
    publicOrigin: 'http://client.test',
    contactEmail: 'operator@example.test',
    rateLimit: 100,
    reportError: () => {},
    ...options,
  });
  app.listen(0, '127.0.0.1');
  await once(app, 'listening');
  t.after(async () => {
    app.closeAllConnections();
    await new Promise((resolve) => app.close(resolve));
    if (typeof store.close === 'function') store.close();
  });
  const base = `http://127.0.0.1:${app.address().port}`;
  const send = (data = validLead(), opts = {}) =>
    fetch(base + '/api/leads', {
      method: 'POST',
      body: typeof data === 'string' ? data : JSON.stringify(data),
      ...opts,
      headers: {
        Origin: 'http://client.test',
        'Content-Type': 'application/json',
        ...opts.headers,
      },
    });
  return { store, app, base, send };
}
