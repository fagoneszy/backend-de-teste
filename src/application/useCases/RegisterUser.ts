import { User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

export interface RegisterUserInput {
  email: string;
  password: string;
  name: string;
  cpf?: string;
}

export class RegisterUser {
  constructor(private userRepo: UserRepository) {}

  async execute(input: RegisterUserInput): Promise<User> {
    const exists = await this.userRepo.findByEmail(input.email);
    if (exists) throw new Error('Email already in use');

    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = new User({
      id: uuidv4(),
      email: input.email,
      passwordHash,
      name: input.name,
      cpf: input.cpf,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await this.userRepo.save(user);
    return user;
  }
}
