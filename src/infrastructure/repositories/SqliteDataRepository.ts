import { DataRecord } from '../../domain/entities/DataRecord';
import { DataRepository } from '../../domain/repositories/DataRepository';
import { getDb, saveDb } from '../database/db';

export class SqliteDataRepository implements DataRepository {
  async findById(id: string): Promise<DataRecord | null> {
    const db = await getDb();
    const stmt = db.prepare('SELECT * FROM data_records WHERE id = ?');
    const row = stmt.get([id]);
    return row ? this.toRecord(row) : null;
  }

  async findByOwner(ownerId: string): Promise<DataRecord[]> {
    const db = await getDb();
    const stmt = db.prepare('SELECT * FROM data_records WHERE owner_id = ? ORDER BY created_at DESC');
    const rows = stmt.all([ownerId]);
    return rows.map((r: any) => this.toRecord(r));
  }

  async save(record: DataRecord): Promise<void> {
    const db = await getDb();
    const stmt = db.prepare('INSERT OR REPLACE INTO data_records (id,owner_id,data,created_at) VALUES (?,?,?,?)');
    stmt.run([record.id, record.ownerId, JSON.stringify(record.data), record.createdAt.toISOString()]);
    saveDb();
  }

  private toRecord(row: any): DataRecord {
    return new DataRecord({
      id: row.id,
      ownerId: row.owner_id,
      data: JSON.parse(row.data),
      createdAt: new Date(row.created_at)
    });
  }
}
