import { FormCard, NotificationBanner, TextLink, TrustSignal } from '../components';
import { ROUTES } from '../routes/paths';

// SCR-007 Post-Deletion Confirmation Screen (J-03, F-03, F-05). Unauthenticated. Placeholder only.
export function PostDeletionConfirmationScreen() {
  return (
    <FormCard heading="Your account has been deleted">
      <NotificationBanner variant="success">
        Your account and all associated data have been permanently removed. A confirmation email has
        been sent to your registered address.
      </NotificationBanner>
      <TextLink to={ROUTES.register}>Create a new account</TextLink>
      <TrustSignal />
    </FormCard>
  );
}
