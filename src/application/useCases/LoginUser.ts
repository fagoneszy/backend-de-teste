import { UserRepository } from '../../domain/repositories/UserRepository';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

export interface LoginUserInput {
  email: string;
  password: string;
}

export class LoginUser {
  constructor(private userRepo: UserRepository) {}

  async execute(input: LoginUserInput): Promise<{ token: string; userId: string }> {
    const user = await this.userRepo.findByEmail(input.email);
    if (!user) throw new Error('Invalid credentials');

    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) throw new Error('Invalid credentials');

    const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    return { token, userId: user.id };
  }
}
