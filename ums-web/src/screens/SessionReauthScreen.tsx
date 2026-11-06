import { useNavigate } from 'react-router-dom';
import {
  FormCard,
  NotificationBanner,
  PasswordInput,
  PrimaryButton,
  SecondaryButton,
  TextInput,
} from '../components';
import { useSession } from '../auth/session';
import { ROUTES } from '../routes/paths';

// SCR-010 Session Re-Authentication Screen — deletion flow (J-03, F-03, F-05). Placeholder only.
// On success the user returns to SCR-006, not the Dashboard.
export function SessionReauthScreen() {
  const { signIn } = useSession();
  const navigate = useNavigate();

  return (
    <FormCard heading="Your session expired — please sign in to continue">
      <NotificationBanner variant="info">
        Your account deletion has NOT been processed. Sign in again to return to the confirmation
        step.
      </NotificationBanner>
      <form
        aria-label="Re-authenticate"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          // TODO(F-02): replace with umsApi.login() and server-issued session.
          signIn();
          navigate(ROUTES.deleteAccount, { replace: true });
        }}
      >
        <TextInput label="Email address" name="email" type="email" autoComplete="email" />
        <PasswordInput label="Password" name="password" autoComplete="current-password" />
        <div className="ums-actions">
          <PrimaryButton type="submit">Sign in to continue</PrimaryButton>
          <SecondaryButton onClick={() => navigate(ROUTES.login)}>Cancel</SecondaryButton>
        </div>
      </form>
    </FormCard>
  );
}
