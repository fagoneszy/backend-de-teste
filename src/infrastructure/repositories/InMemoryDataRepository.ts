import { DataRecord } from '../../domain/entities/DataRecord';
import { DataRepository } from '../../domain/repositories/DataRepository';

export class InMemoryDataRepository implements DataRepository {
  private store = new Map<string, DataRecord>();

  async findById(id: string): Promise<DataRecord | null> {
    return this.store.get(id) || null;
  }

  async findByOwner(ownerId: string): Promise<DataRecord[]> {
    const result: DataRecord[] = [];
    for (const record of this.store.values()) {
      if (record.ownerId === ownerId) result.push(record);
    }
    return result;
  }

  async save(record: DataRecord): Promise<void> {
    this.store.set(record.id, record);
  }
}
