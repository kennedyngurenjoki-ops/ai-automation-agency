import { resolve } from 'node:path';
import { LeadStore, leadsCsv } from './store.mjs';
import { isUuid } from '../shared/lead-schema.js';

const [command, id, confirmation] = process.argv.slice(2);
if (!['list', 'export', 'delete', 'purge-expired'].includes(command)) {
  console.error(
    'Usage: node server/manage-leads.mjs list | export | delete <id> --confirm | purge-expired',
  );
  process.exitCode = 1;
} else if (command === 'delete' && (!isUuid(id) || confirmation !== '--confirm')) {
  console.error('Deletion requires a valid receipt ID and --confirm.');
  process.exitCode = 1;
} else {
  const store = new LeadStore(resolve(process.env.LEADS_DB_PATH || 'data/leads.sqlite'), {
    retentionDays: Number(process.env.LEAD_RETENTION_DAYS ?? 90),
  });
  try {
    if (command === 'list') console.log(JSON.stringify(store.list(), null, 2));
    if (command === 'export') process.stdout.write(leadsCsv(store.list()));
    if (command === 'delete') console.log(JSON.stringify({ deleted: store.remove(id) }));
    if (command === 'purge-expired') console.log(JSON.stringify({ removed: store.purgeExpired() }));
  } finally {
    store.close();
  }
}
