import { DataRecord } from '../../domain/entities/DataRecord';
import { DataRepository } from '../../domain/repositories/DataRepository';
import { v4 as uuidv4 } from 'uuid';

export interface ProcessDataInput {
  ownerId: string;
  rawData: Record<string, unknown>;
}

export class ProcessData {
  constructor(private dataRepo: DataRepository) {}

  private sanitize(value: unknown): unknown {
    if (typeof value === 'string') {
      return value.trim().replace(/[<>]/g, '');
    }
    if (Array.isArray(value)) {
      return value.map(v => this.sanitize(v));
    }
    if (typeof value === 'object' && value !== null) {
      const out: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(value)) {
        out[k] = this.sanitize(v);
      }
      return out;
    }
    return value;
  }

  private validateFields(data: Record<string, unknown>): Record<string, unknown> {
    const filtered: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (!key || key.length > 100) continue;
      if (value === null || value === undefined) continue;
      filtered[key] = this.sanitize(value);
    }
    return filtered;
  }

  async execute(input: ProcessDataInput): Promise<DataRecord> {
    const organized = this.validateFields(input.rawData);
    const record = new DataRecord({
      id: uuidv4(),
      ownerId: input.ownerId,
      data: organized,
      createdAt: new Date()
    });
    await this.dataRepo.save(record);
    return record;
  }
}
