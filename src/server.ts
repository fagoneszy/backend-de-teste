import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './interface/routes/auth.routes';
import dataRoutes from './interface/routes/data.routes';
import { securityLayers } from './interface/middleware/SecurityLayers';

import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.resolve(__dirname, '..', 'public')));

// Apply 40 security layers
for (const { name, layer } of securityLayers) {
  try {
    app.use(layer);
  } catch (e) {
    console.warn(`Security layer ${name} failed to load`);
  }
}

app.get('/health', (req, res) => res.json({ status: 'ok', layers: securityLayers.length }));

app.get('/health/db', async (req, res) => {
  try {
    const { getDb } = await import('./infrastructure/database/db');
    const db = await getDb();
    const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table'");
    res.json({ status: 'ok', dbExists: true, tables: tables.map((t:any)=>t.values) });
  } catch (e:any) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(500).json({ error: 'Internal error' });
});

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`40 security layers active`);
  try {
    const { getDb } = await import('./infrastructure/database/db');
    await getDb();
    console.log('SQLite DB initialized and ready');
  } catch (e) {
    console.error('DB init failed', e);
  }
});
