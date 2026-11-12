import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, chmodSync } from 'node:fs';
import { dirname } from 'node:path';
import { createHash, randomUUID } from 'node:crypto';

export class LeadStore {
  constructor(filename, { retentionDays = 90, now = () => Date.now() } = {}) {
    if (!Number.isInteger(retentionDays) || retentionDays < 1 || retentionDays > 365)
      throw new Error('Retention must be 1–365 days.');
    this.retentionDays = retentionDays;
    this.now = now;
    if (filename !== ':memory:') mkdirSync(dirname(filename), { recursive: true, mode: 0o700 });
    this.db = new DatabaseSync(filename);
    if (filename !== ':memory:') chmodSync(filename, 0o600);
    this.db.exec(`PRAGMA busy_timeout=3000; PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL;
      CREATE TABLE IF NOT EXISTS leads (
        id TEXT PRIMARY KEY, submission_id TEXT NOT NULL UNIQUE, payload_hash TEXT NOT NULL,
        received_at TEXT NOT NULL, data TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS leads_received_at ON leads(received_at);`);
    this.purgeExpired();
  }
  purgeExpired() {
    const cutoff = new Date(this.now() - this.retentionDays * 86400000).toISOString();
    return this.db.prepare('DELETE FROM leads WHERE received_at < ?').run(cutoff).changes;
  }
  save(submissionId, data) {
    this.purgeExpired();
    const payload = JSON.stringify(data);
    const hash = createHash('sha256').update(payload).digest('hex');
    const existing = this.db
      .prepare('SELECT id,received_at,payload_hash FROM leads WHERE submission_id=?')
      .get(submissionId);
    if (existing) {
      if (existing.payload_hash !== hash) {
        const error = new Error('Start a new request after changing a submitted form.');
        error.status = 409;
        throw error;
      }
      return { created: false, receipt: { id: existing.id, receivedAt: existing.received_at } };
    }
    const id = randomUUID(),
      receivedAt = new Date(this.now()).toISOString();
    this.db
      .prepare(
        'INSERT INTO leads(id,submission_id,payload_hash,received_at,data) VALUES(?,?,?,?,?)',
      )
      .run(id, submissionId, hash, receivedAt, payload);
    return { created: true, receipt: { id, receivedAt } };
  }
  list() {
    this.purgeExpired();
    return this.db
      .prepare('SELECT id,received_at,data FROM leads ORDER BY received_at DESC')
      .all()
      .map((row) => ({ id: row.id, receivedAt: row.received_at, ...JSON.parse(row.data) }));
  }
  remove(id) {
    return this.db.prepare('DELETE FROM leads WHERE id=?').run(id).changes;
  }
  healthy() {
    return this.db.prepare('SELECT 1 AS ok').get().ok === 1;
  }
  close() {
    this.db.close();
  }
}
export function csvCell(value) {
  let text = Array.isArray(value) ? value.join('; ') : String(value ?? '');
  if (/^[\s]*[=+\-@]/u.test(text) || /^[\t\r\n]/u.test(text)) text = "'" + text;
  return '"' + text.replaceAll('"', '""') + '"';
}
export function leadsCsv(leads) {
  const fields = [
    'id',
    'receivedAt',
    'companyName',
    'name',
    'email',
    'phone',
    'industry',
    'workflow',
    'budget',
    'timeline',
    'currentTools',
    'consent',
    'privacyVersion',
  ];
  return (
    [
      fields.map(csvCell).join(','),
      ...leads.map((lead) => fields.map((f) => csvCell(lead[f])).join(',')),
    ].join('\r\n') + '\r\n'
  );
}
