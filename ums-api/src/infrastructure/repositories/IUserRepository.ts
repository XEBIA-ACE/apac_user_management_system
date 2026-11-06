import type { AccountStatus } from '../../domain/AccountStatus';
import type { User } from '../../domain/User';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<User>;
  updateStatus(id: string, status: AccountStatus): Promise<void>;
  deleteById(id: string): Promise<void>;
}
