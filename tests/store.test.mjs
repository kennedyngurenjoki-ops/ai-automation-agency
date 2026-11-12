import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { mkdtempSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { LeadStore, csvCell, leadsCsv } from '../server/store.mjs';
import { validLead } from './helpers.mjs';
test('lead survives a database close and reopen with restricted file permissions', () => {
  const dir = mkdtempSync(join(tmpdir(), 'intake-test-'));
  try {
    const file = join(dir, 'leads.sqlite');
    let db = new LeadStore(file);
    const key = randomUUID(),
      data = validLead();
    const saved = db.save(key, data);
    db.close();
    db = new LeadStore(file);
    assert.equal(db.list().length, 1);
    assert.equal(db.save(key, data).receipt.id, saved.receipt.id);
    assert.equal(statSync(file).mode & 0o777, 0o600);
    assert.throws(
      () => db.save(key, { ...data, name: 'Changed' }),
      (e) => e.status === 409,
    );
    db.close();
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
test('retention expires old requests without removing recent ones', () => {
  let clock = Date.UTC(2026, 0, 1);
  const db = new LeadStore(':memory:', { retentionDays: 1, now: () => clock });
  try {
    db.save(randomUUID(), validLead());
    clock += 2 * 86400000;
    const fresh = db.save(randomUUID(), validLead());
    assert.deepEqual(
      db.list().map((x) => x.id),
      [fresh.receipt.id],
    );
  } finally {
    db.close();
  }
});
test('invalid retention cannot silently purge the database', () => {
  for (const retentionDays of [0, -1, 366, NaN])
    assert.throws(() => new LeadStore(':memory:', { retentionDays }));
});
test('owner deletion removes only the requested receipt', () => {
  const db = new LeadStore(':memory:');
  try {
    const a = db.save(randomUUID(), validLead()),
      b = db.save(randomUUID(), validLead());
    assert.equal(db.remove(a.receipt.id), 1);
    assert.deepEqual(
      db.list().map((x) => x.id),
      [b.receipt.id],
    );
  } finally {
    db.close();
  }
});
test('CSV export escapes formulas, quotes and line breaks', () => {
  for (const v of ['=1+1', '+SUM(A1:A2)', '-1+2', '@command', '  =formula', '\t=cmd'])
    assert.ok(csvCell(v).startsWith('"\''));
  const out = leadsCsv([{ id: randomUUID(), companyName: 'A, "quoted"\nname' }]);
  assert.match(out, /""quoted""/);
  assert.match(out, /\r\n/);
});
