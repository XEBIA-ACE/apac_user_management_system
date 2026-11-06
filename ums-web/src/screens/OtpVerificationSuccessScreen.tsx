import { useNavigate } from 'react-router-dom';
import { FormCard, NotificationBanner, PrimaryButton, TrustSignal } from '../components';
import { ROUTES } from '../routes/paths';

// SCR-003 OTP Verification Success Screen (J-01, J-04, F-01). Placeholder only.
export function OtpVerificationSuccessScreen() {
  const navigate = useNavigate();
  return (
    <FormCard heading="Account activated!">
      <NotificationBanner variant="success">
        Your email has been verified and your account is now active.
      </NotificationBanner>
      <PrimaryButton onClick={() => navigate(ROUTES.login)}>Continue to Login</PrimaryButton>
      <TrustSignal />
    </FormCard>
  );
}
