export interface UserProps {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  cpf?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  constructor(private props: UserProps) {}

  get id() { return this.props.id; }
  get email() { return this.props.email; }
  get passwordHash() { return this.props.passwordHash; }
  get name() { return this.props.name; }
  get cpf() { return this.props.cpf; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }

  toJSON() {
    const { passwordHash, ...rest } = this.props;
    return rest;
  }
}
