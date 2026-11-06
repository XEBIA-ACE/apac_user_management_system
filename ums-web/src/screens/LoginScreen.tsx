import { useNavigate } from 'react-router-dom';
import {
  FormCard,
  PasswordInput,
  PrimaryButton,
  TextInput,
  TextLink,
  TrustSignal,
} from '../components';
import { useSession } from '../auth/session';
import { ROUTES } from '../routes/paths';

// SCR-004 Login Screen (J-02, J-04, F-02, F-04, F-05). Placeholder only.
export function LoginScreen() {
  const { signIn } = useSession();
  const navigate = useNavigate();

  return (
    <FormCard heading="Sign in">
      <form
        aria-label="Sign in"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          // TODO(F-02): replace with umsApi.login() and server-issued session.
          signIn();
          navigate(ROUTES.dashboard);
        }}
      >
        <TextInput label="Email address" name="email" type="email" autoComplete="email" />
        <PasswordInput label="Password" name="password" autoComplete="current-password" />
        <PrimaryButton type="submit">Sign in</PrimaryButton>
      </form>
      <p>
        <TextLink to={ROUTES.otpRecovery}>Complete verification</TextLink>
      </p>
      <p>
        New here? <TextLink to={ROUTES.register}>Create an account</TextLink>
      </p>
      <TrustSignal text="Secured with HTTPS" />
    </FormCard>
  );
}
