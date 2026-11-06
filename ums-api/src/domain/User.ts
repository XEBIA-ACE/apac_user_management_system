import { AccountStatus } from './AccountStatus';

// TODO(stakeholder): PII encryption-at-rest approach for `name` and `email` (algorithm, key
// management) is unresolved (US-022).
export class User {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public hashedPassword: string,
    public status: AccountStatus,
    public createdAt: Date,
    public deletedAt: Date | null = null,
  ) {}
}
