import { useEffect, useId, useState } from 'react';
import { isAxiosError } from 'axios';
import { Navigate } from 'react-router-dom';
import { z } from 'zod';
import { umsApi } from '../api/endpoints';
import { useSession } from '../auth/session';
import { DashboardSection, NotificationBanner } from '../components';
import { ROUTES } from '../routes/paths';

// Subset of GET /api/dashboard (UserDTO) needed by the profile page. The endpoint derives the
// user solely from the session token, so only the authenticated user's own record is returned
// (US-017-ac-5).
const profileSchema = z.object({
  user: z.object({
    name: z.string(),
    email: z.string(),
    is_verified: z.boolean(),
    created_at: z.string(),
  }),
});

interface Profile {
  name: string;
  email: string;
  registrationDate: string;
  accountStatus: string;
}

type ProfileStatus = 'loading' | 'ready' | 'unauthenticated' | 'error';

function toProfile(data: unknown): Profile {
  const { user } = profileSchema.parse(data);
  const created = new Date(user.created_at);
  return {
    name: user.name,
    email: user.email,
    registrationDate: Number.isNaN(created.getTime())
      ? user.created_at
      : created.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          timeZone: 'UTC',
        }),
    accountStatus: user.is_verified ? 'Active' : 'Pending verification',
  };
}

function ProfileField({ label, value }: { label: string; value: string }) {
  const labelId = useId();
  return (
    <div className="ums-profile-field">
      <dt id={labelId}>{label}</dt>
      <dd aria-labelledby={labelId}>{value}</dd>
    </div>
  );
}

// US-017: read-only profile. Values are plain text in a description list; no form controls.
export function ProfileScreen() {
  const { signOut } = useSession();
  const [status, setStatus] = useState<ProfileStatus>('loading');
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    let cancelled = false;
    umsApi
      .getDashboard()
      .then((response) => {
        if (cancelled) return;
        setProfile(toProfile(response.data));
        setStatus('ready');
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
    return <Navigate to={ROUTES.login} replace state={{ from: ROUTES.profile }} />;
  }

  return (
    <>
      <div className="ums-dashboard-section">
        <h1>Profile</h1>
      </div>
      {status === 'error' && (
        <NotificationBanner variant="error">
          We could not load your profile. Please try again.
        </NotificationBanner>
      )}
      {status === 'ready' && profile && (
        <DashboardSection heading="Account details">
          <dl>
            <ProfileField label="Name" value={profile.name} />
            <ProfileField label="Email Address" value={profile.email} />
            <ProfileField label="Registration Date" value={profile.registrationDate} />
            <ProfileField label="Account Status" value={profile.accountStatus} />
          </dl>
        </DashboardSection>
      )}
    </>
  );
}
