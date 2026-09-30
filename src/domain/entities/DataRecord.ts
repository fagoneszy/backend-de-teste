export interface DataRecordProps {
  id: string;
  ownerId: string;
  data: Record<string, unknown>;
  createdAt: Date;
}

export class DataRecord {
  constructor(private props: DataRecordProps) {}

  get id() { return this.props.id; }
  get ownerId() { return this.props.ownerId; }
  get data() { return this.props.data; }
  get createdAt() { return this.props.createdAt; }

  toJSON() {
    return this.props;
  }
}
