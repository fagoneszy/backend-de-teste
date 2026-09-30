import { User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { getDb, saveDb } from '../database/db';

export class SqliteUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    const db = await getDb();
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    const row = stmt.get([id]);
    return row ? this.toUser(row) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const db = await getDb();
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const row = stmt.get([email]);
    return row ? this.toUser(row) : null;
  }

  async save(user: User): Promise<void> {
    const db = await getDb();
    const stmt = db.prepare(`INSERT OR REPLACE INTO users (id,email,password_hash,name,cpf,created_at,updated_at) VALUES (?,?,?,?,?,?,?)`);
    stmt.run([user.id, user.email, user.passwordHash, user.name, user.cpf || null, user.createdAt.toISOString(), user.updatedAt.toISOString()]);
    saveDb();
  }

  async delete(id: string): Promise<void> {
    const db = await getDb();
    db.prepare('DELETE FROM users WHERE id = ?').run([id]);
    saveDb();
  }

  private toUser(row: any): User {
    return new User({
      id: row.id,
      email: row.email,
      passwordHash: row.password_hash,
      name: row.name,
      cpf: row.cpf,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    });
  }
}
