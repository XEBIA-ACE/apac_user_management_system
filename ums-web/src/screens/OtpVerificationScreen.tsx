import {
  CountdownTimer,
  FormCard,
  OtpInputField,
  PrimaryButton,
  TextButton,
  TextLink,
  TrustSignal,
} from '../components';
import { ROUTES } from '../routes/paths';

const OTP_VALIDITY_SECONDS = 5 * 60;

// SCR-002 OTP Verification Screen (J-01, J-04, F-01, F-04, F-05). Placeholder only.
// TODO(OTP format/length TBD): OTP input type and length are pending stakeholder decision.
// TODO(OQ-01): Resend OTP max attempts and cooldown period are TBD.
// TODO(OQ-02): Maximum incorrect OTP submissions before lockout is TBD.
export function OtpVerificationScreen() {
  return (
    <FormCard heading="Verify your email">
      <p>Enter the one-time passcode sent to your email address.</p>
      <CountdownTimer secondsRemaining={OTP_VALIDITY_SECONDS} />
      <form aria-label="OTP verification" noValidate onSubmit={(e) => e.preventDefault()}>
        <OtpInputField label="One-time passcode" name="otp" />
        <PrimaryButton type="submit">Verify</PrimaryButton>
      </form>
      <TextButton>Resend OTP</TextButton>
      <p>
        <TextLink to={ROUTES.otpRecovery}>Having trouble? Go to the OTP Recovery Hub</TextLink>
      </p>
      <TrustSignal />
    </FormCard>
  );
}
