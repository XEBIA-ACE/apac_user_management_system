import { BrowserRouter } from 'react-router-dom';
import { SessionProvider } from './auth/SessionContext';
import type { AppConfig } from './config/env';
import { AppRoutes } from './routes/AppRoutes';

export function App({ config }: { config: AppConfig }) {
  return (
    <BrowserRouter>
      <SessionProvider initialAuthenticated={config.features.scaffoldAuthBypass}>
        <AppRoutes />
      </SessionProvider>
    </BrowserRouter>
  );
}
