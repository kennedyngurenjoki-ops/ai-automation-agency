import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { submitLead } from '../src/lib/api.js';
import { estimateCapacity } from '../src/lib/roi.js';
const receipt = { id: randomUUID(), receivedAt: new Date().toISOString() };
const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
test('client accepts a well-formed storage receipt only', async () =>
  assert.deepEqual(
    await submitLead({}, randomUUID(), {
      fetchImpl: async () => json({ accepted: true, receipt }, 201),
    }),
    receipt,
  ));
test('a static HTML fallback cannot look like successful form delivery', async () =>
  assert.rejects(
    submitLead({}, randomUUID(), {
      fetchImpl: async () =>
        new Response('<html>site</html>', { headers: { 'Content-Type': 'text/html' } }),
    }),
    /not been confirmed/,
  ));
for (const result of [
  { accepted: false, receipt },
  { accepted: true },
  { accepted: true, receipt: { id: 'fake', receivedAt: receipt.receivedAt } },
])
  test('rejects malformed acknowledgement ' + JSON.stringify(result), async () =>
    assert.rejects(
      submitLead({}, randomUUID(), { fetchImpl: async () => json(result) }),
      /not been confirmed/,
    ),
  );
test('client surfaces server failure and field errors', async () => {
  await assert.rejects(
    submitLead({}, randomUUID(), {
      fetchImpl: async () => json({ error: 'Check consent', errors: { consent: 'Needed' } }, 422),
    }),
    (error) => error.message === 'Check consent' && error.fields.consent === 'Needed',
  );
});
test('timed-out requests are reported as unconfirmed, not completed', async () => {
  await assert.rejects(
    submitLead({}, randomUUID(), {
      timeoutMs: 5,
      fetchImpl: async (_url, { signal }) =>
        new Promise((_resolve, reject) =>
          signal.addEventListener(
            'abort',
            () => reject(new DOMException('aborted', 'AbortError')),
            { once: true },
          ),
        ),
    }),
    /timed out/,
  );
});
test('capacity estimate is arithmetic, not a revenue guarantee', () => {
  const r = estimateCapacity('10', '15', '50');
  assert.equal(Math.round(r.monthlyHours * 100), 2165);
  assert.equal(Math.round(r.monthlyCapacityValue * 100), 32475);
  for (const v of [
    [-1, 1, 1],
    [1, 1, 101],
    [169, 1, 10],
    [1, Infinity, 1],
  ])
    assert.equal(estimateCapacity(...v), null);
});
