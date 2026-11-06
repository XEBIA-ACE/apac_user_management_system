import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ROUTES } from '../routes/paths';
import { useSession } from './session';

// Guards post-auth routes (SCR-005, SCR-006, SCR-009). Unauthenticated users are
// redirected to Login (J-02 "No Valid Session"). The originating location is
// preserved so session-expiry-aware re-entry (J-03 SCR-010 -> SCR-006) can return
// the user to where they were.
export function RequireAuth() {
  const { isAuthenticated } = useSession();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}
