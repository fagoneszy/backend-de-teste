import { UserRepository } from '../../domain/repositories/UserRepository';
import { DataRepository } from '../../domain/repositories/DataRepository';

export class GetUserOwnData {
  constructor(private userRepo: UserRepository, private dataRepo: DataRepository) {}

  async execute(requesterId: string, targetUserId: string) {
    if (requesterId !== targetUserId) {
      throw new Error('Access denied: you can only view your own data');
    }
    const user = await this.userRepo.findById(targetUserId);
    if (!user) throw new Error('User not found');
    const records = await this.dataRepo.findByOwner(targetUserId);
    return { user: user.toJSON(), records: records.map(r => r.toJSON()) };
  }
}
