import { FormCard, PrimaryButton, TextInput, TextLink } from '../components';
import { ROUTES } from '../routes/paths';

// SCR-008 OTP Recovery Hub Screen (J-04, J-01, F-04, F-05). Placeholder only.
// TODO(OQ-01): Resend max attempts and cooldown period (rate-limit state) are TBD.
export function OtpRecoveryHubScreen() {
  return (
    <FormCard heading="Complete your verification">
      <p>Enter your email address and we will send a new verification code if applicable.</p>
      <form aria-label="Resend verification email" noValidate onSubmit={(e) => e.preventDefault()}>
        <TextInput label="Email address" name="email" type="email" autoComplete="email" />
        <PrimaryButton type="submit">Send verification email</PrimaryButton>
      </form>
      <TextLink to={ROUTES.login}>Back to Login</TextLink>
    </FormCard>
  );
}
