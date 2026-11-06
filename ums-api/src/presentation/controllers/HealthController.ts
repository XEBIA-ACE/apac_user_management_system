import type { Request, Response } from 'express';

export type DatabaseProbe = () => Promise<boolean>;

export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy';

export interface HealthResponse {
  status: HealthStatus;
  timestamp: string;
  dependencies: {
    database: string;
    smtp?: string;
  };
}

/** GET /api/v1/health (EP-API-007). Unauthenticated; exposes only up/down per dependency. */
export class HealthController {
  constructor(private readonly checkDatabase: DatabaseProbe) {}

  getHealth = async (_req: Request, res: Response): Promise<void> => {
    const databaseUp = await this.checkDatabase();
    const body: HealthResponse = {
      status: databaseUp ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      dependencies: { database: databaseUp ? 'up' : 'down' },
    };
    res.setHeader('Cache-Control', 'no-store');
    res.status(databaseUp ? 200 : 503).json(body);
  };
}
