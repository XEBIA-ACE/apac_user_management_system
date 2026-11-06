import { loadConfig } from './env';

describe('loadConfig', () => {
  it('reads configuration from environment variables', () => {
    const config = loadConfig({
      VITE_API_BASE_URL: 'https://api.example.test',
      VITE_API_TIMEOUT_MS: '5000',
      VITE_FEATURE_SCAFFOLD_AUTH_BYPASS: 'true',
    });
    expect(config).toEqual({
      apiBaseUrl: 'https://api.example.test',
      apiTimeoutMs: 5000,
      features: { scaffoldAuthBypass: true },
    });
  });

  it('applies defaults for optional values', () => {
    const config = loadConfig({ VITE_API_BASE_URL: 'https://api.example.test' });
    expect(config.apiTimeoutMs).toBe(10000);
    expect(config.features.scaffoldAuthBypass).toBe(false);
  });

  it('fails fast when the API base URL is missing', () => {
    expect(() => loadConfig({})).toThrow(/VITE_API_BASE_URL is required/);
  });

  it('rejects an invalid API base URL', () => {
    expect(() => loadConfig({ VITE_API_BASE_URL: 'not-a-url' })).toThrow(/valid URL/);
  });
});
