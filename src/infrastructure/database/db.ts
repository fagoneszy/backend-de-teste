import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';

const dbPath = path.resolve(__dirname, '../../../dev.db');
let dbInstance: any = null;
let SQL: any = null;

export async function getDb() {
  if (!SQL) {
    SQL = await initSqlJs();
  }
  if (!dbInstance) {
    if (fs.existsSync(dbPath)) {
      const buf = fs.readFileSync(dbPath);
      if (buf.length > 0) {
        dbInstance = new SQL.Database(buf);
      } else {
        dbInstance = new SQL.Database();
      }
    } else {
      dbInstance = new SQL.Database();
    }
    dbInstance.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        cpf TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS data_records (
        id TEXT PRIMARY KEY,
        owner_id TEXT NOT NULL,
        data TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY(owner_id) REFERENCES users(id)
      );
    `);
  }
  return dbInstance;
}

export function saveDb() {
  if (!dbInstance) return;
  const data = dbInstance.export();
  fs.writeFileSync(dbPath, Buffer.from(data));
}
