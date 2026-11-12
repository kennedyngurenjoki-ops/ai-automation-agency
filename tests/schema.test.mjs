import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { emptyLead, validateLead, isUuid, PRIVACY_VERSION } from '../shared/lead-schema.js';
import { validLead } from './helpers.mjs';
test('valid lead is normalized and unknown fields are discarded', () => {
  const r = validateLead(validLead({ name: '  Test Buyer  ', admin: true }));
  assert.equal(r.valid, true);
  assert.equal(r.data.name, 'Test Buyer');
  assert.equal('admin' in r.data, false);
});
test('null and arrays fail safely', () => {
  assert.equal(validateLead(null).valid, false);
  assert.equal(validateLead([]).valid, false);
});
for (const [name, change] of [
  ['email', { email: 'invalid' }],
  ['type', { companyName: 7 }],
  ['length', { companyName: 'x'.repeat(121) }],
  ['workflow', { workflow: 'short' }],
  ['option', { industry: 'Unknown' }],
  ['array', { currentChallenges: 'Lead capture' }],
  ['unknown checkbox', { automationGoals: ['Invented'] }],
  ['consent string', { consent: 'true' }],
  ['stale notice', { privacyVersion: 'old' }],
  ['honeypot', { websiteTrap: 'bot' }],
  ['unsafe URL', { website: 'javascript:alert(1)' }],
  ['URL credentials', { website: 'https://user:password@example.test' }],
  ['control character', { name: 'A\u0000B' }],
])
  test('rejects invalid ' + name, () => assert.equal(validateLead(validLead(change)).valid, false));
test('step validation does not block on future steps', () =>
  assert.equal(
    validateLead(
      {
        ...emptyLead(),
        companyName: 'Sample',
        industry: 'Professional services',
        companySize: 'Just me',
      },
      1,
    ).valid,
    true,
  ));
test('checkbox values are deduplicated', () =>
  assert.deepEqual(
    validateLead(validLead({ currentChallenges: ['Lead capture', 'Lead capture'] })).data
      .currentChallenges,
    ['Lead capture'],
  ));
test('UUIDs are constrained and privacy notice is versioned', () => {
  assert.equal(isUuid(randomUUID()), true);
  assert.equal(isUuid('not-a-uuid'), false);
  assert.ok(PRIVACY_VERSION);
});
