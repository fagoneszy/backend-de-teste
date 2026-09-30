import { DataRecord } from '../entities/DataRecord';

export interface DataRepository {
  findById(id: string): Promise<DataRecord | null>;
  findByOwner(ownerId: string): Promise<DataRecord[]>;
  save(record: DataRecord): Promise<void>;
}
