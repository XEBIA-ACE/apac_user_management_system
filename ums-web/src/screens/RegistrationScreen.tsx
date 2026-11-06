import {
  FormCard,
  PasswordInput,
  PrimaryButton,
  TextInput,
  TextLink,
  TrustSignal,
} from '../components';
import { ROUTES } from '../routes/paths';

// SCR-001 Registration Screen (J-01, F-01, F-05). Placeholder only.
// TODO(OQ-04): Password complexity rules are TBD.
// TODO(OQ-11): Duplicate-email disclosure policy for the error state is TBD.
export function RegistrationScreen() {
  return (
    <FormCard heading="Create your account">
      <form aria-label="Registration" noValidate onSubmit={(e) => e.preventDefault()}>
        <TextInput label="Name" name="name" autoComplete="name" />
        <TextInput label="Email address" name="email" type="email" autoComplete="email" />
        <PasswordInput label="Password" name="password" autoComplete="new-password" />
        <PrimaryButton type="submit">Register</PrimaryButton>
      </form>
      <p>
        Already have an account? <TextLink to={ROUTES.login}>Sign in</TextLink>
      </p>
      <TrustSignal text="Secured with HTTPS" />
    </FormCard>
  );
}
