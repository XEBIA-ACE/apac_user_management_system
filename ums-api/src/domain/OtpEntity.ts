export class OtpEntity {
  constructor(
    public id: string,
    public userId: string,
    public code: string,
    public expiresAt: Date,
    public isUsed: boolean,
    public createdAt: Date,
  ) {}
}
