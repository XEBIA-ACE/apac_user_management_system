import type { PrismaClient } from '@prisma/client';
import { AppError } from '../../domain/AppError';
import { AccountStatus } from '../../domain/AccountStatus';
import { User } from '../../domain/User';
import type { IUserRepository } from './IUserRepository';

// All SQL/ORM logic for the users table lives here (PAT-003). Receives only already-hashed
// passwords; plaintext passwords must never reach this layer (US-018).
export class PostgresUserRepository implements IUserRepository {
  constructor(protected readonly db: PrismaClient) {}

  async findByEmail(_email: string): Promise<User | null> {
    throw AppError.notImplemented();
  }

  async findById(id: string): Promise<User | null> {
    const row = await this.db.user.findUnique({ where: { id } });
    return row
      ? new User(
          row.id,
          row.name,
          row.email,
          row.hashedPassword,
          AccountStatus[row.status],
          row.createdAt,
          row.deletedAt,
        )
      : null;
  }

  async save(_user: User): Promise<User> {
    throw AppError.notImplemented();
  }

  async updateStatus(_id: string, _status: AccountStatus): Promise<void> {
    throw AppError.notImplemented();
  }

  // Hard DELETE (F-03); OTP rows are removed via ON DELETE CASCADE. Called only from
  // UserService.deleteAccount() inside a transaction.
  // TODO(stakeholder): data retention period for deleted-account audit trails is unresolved.
  async deleteById(_id: string): Promise<void> {
    throw AppError.notImplemented();
  }
}
