import { createApp } from './app';
import { ConfigError, loadConfig, type AppConfig } from './config';
import { buildContainer } from './container';
import { createLogger } from './logger';

function readConfig(): AppConfig {
  try {
    return loadConfig();
  } catch (err) {
    const issues = err instanceof ConfigError ? err.issues : [(err as Error).message];
    process.stderr.write(
      `${JSON.stringify({ level: 'error', message: 'Invalid configuration', issues })}\n`,
    );
    process.exit(1);
  }
}

function main(): void {
  const config = readConfig();
  const logger = createLogger(config.logLevel);
  const container = buildContainer(config, logger);
  const app = createApp(container.deps);

  const server = app.listen(config.port, () => {
    logger.info('ums-api listening', { port: config.port, env: config.nodeEnv });
  });

  const shutdown = (signal: string): void => {
    logger.info('Shutting down', { signal });
    server.close(() => {
      container
        .shutdown()
        .catch((err: unknown) => logger.error('Shutdown error', { error: (err as Error).message }))
        .finally(() => process.exit(0));
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

main();
