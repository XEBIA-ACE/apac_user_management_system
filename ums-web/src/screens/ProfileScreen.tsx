import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import { Navigate } from 'react-router-dom';
import { umsApi } from '../api/endpoints';
import { useSession } from '../auth/session';
import { DashboardSection, NotificationBanner } from '../components';
import { ROUTES } from '../routes/paths';

interface ProfileUser {
  name: string;
  email: string;
  created_at: string;
  account_status: string;
}

type ProfileState =
  | { status: 'loading' }
  | { status: 'unauthenticated' }
  | { status: 'error' }
  | { status: 'ready'; user: ProfileUser };

// US-005: read-only account details. Renders text only; no inputs, edit or save controls.
export function ProfileScreen() {
  const { signOut } = useSession();
  const [state, setState] = useState<ProfileState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    umsApi
      .getProfile()
      .then((res) => {
        if (!cancelled) setState({ status: 'ready', user: res.data.user as ProfileUser });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        if (isAxiosError(error) && error.response?.status === 401) {
          signOut();
          setState({ status: 'unauthenticated' });
        } else {
          setState({ status: 'error' });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [signOut]);

  if (state.status === 'unauthenticated') {
    return <Navigate to={ROUTES.login} replace state={{ from: ROUTES.profile }} />;
  }

  return (
    <>
      <div className="ums-dashboard-section">
        <h1>Profile</h1>
      </div>
      {state.status === 'error' && (
        <NotificationBanner variant="error">
          We could not load your account details. Please try again.
        </NotificationBanner>
      )}
      {state.status === 'ready' && (
        <DashboardSection heading="User Details (Read Only)">
          <dl>
            <dt>Name</dt>
            <dd>{state.user.name}</dd>
            <dt>Email Address</dt>
            <dd>{state.user.email}</dd>
            <dt>Registration Date</dt>
            <dd>{new Date(state.user.created_at).toLocaleDateString()}</dd>
            <dt>Account Status</dt>
            <dd>{state.user.account_status}</dd>
          </dl>
        </DashboardSection>
      )}
    </>
  );
}
