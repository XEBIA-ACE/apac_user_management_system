import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import { Navigate } from 'react-router-dom';
import { umsApi } from '../api/endpoints';
import { useSession } from '../auth/session';
import { DashboardSection, NotificationBanner, TextLink, TrustSignal } from '../components';
import { ROUTES } from '../routes/paths';

type DashboardStatus = 'loading' | 'ready' | 'unauthenticated' | 'error';

// SCR-005 Dashboard Screen (J-02, J-03, F-02, F-03, F-05).
// US-001: the 'Delete Account' entry point is rendered only after GET /api/dashboard
// returns 200. A 401 (missing, expired or blacklisted token) clears the session and
// redirects to Login; every other state (loading, error) renders no entry point.
// TODO(OQ-05): Session-expiry warning state depends on the TBD session timeout duration.
export function DashboardScreen() {
  const { signOut } = useSession();
  const [status, setStatus] = useState<DashboardStatus>('loading');

  useEffect(() => {
    let cancelled = false;
    umsApi
      .getDashboard()
      .then(() => {
        if (!cancelled) setStatus('ready');
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        if (isAxiosError(error) && error.response?.status === 401) {
          signOut();
          setStatus('unauthenticated');
        } else {
          setStatus('error');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [signOut]);

  if (status === 'unauthenticated') {
    return <Navigate to={ROUTES.login} replace state={{ from: ROUTES.dashboard }} />;
  }

  return (
    <>
      <div className="ums-dashboard-section">
        <h1>Dashboard</h1>
      </div>
      {status === 'error' && (
        <NotificationBanner variant="error">
          We could not load your dashboard. Please try again.
        </NotificationBanner>
      )}
      <DashboardSection heading="Welcome">
        <p>Protected dashboard content will appear here.</p>
        <TrustSignal />
      </DashboardSection>
      {status === 'ready' && (
        <DashboardSection heading="Danger Zone" danger>
          {/* Initiates the deletion flow (DELETE /api/users/me is consumed from the
              confirmation screen); the deletion call itself is out of scope here. */}
          <TextLink to={ROUTES.deleteAccount}>Delete Account</TextLink>
        </DashboardSection>
      )}
    </>
  );
}
