import { useNavigate } from 'react-router-dom';
import { ConfirmationDialog, DestructiveButton, SecondaryButton, TrustSignal } from '../components';
import { ROUTES } from '../routes/paths';

// SCR-006 Account Deletion Confirmation Screen (J-03, F-03, F-05). Placeholder only.
// TODO(OQ-06): Itemised list of data entities removed on deletion is TBD.
// TODO(F-05 CONC): Concurrent deletion request UX handling is TBD.
export function AccountDeletionConfirmationScreen() {
  const navigate = useNavigate();
  return (
    <ConfirmationDialog
      heading="Delete your account"
      irreversibilityStatement="This action is permanent and cannot be undone."
      actions={
        <>
          <DestructiveButton isDisabled>Delete my account</DestructiveButton>
          <SecondaryButton onClick={() => navigate(ROUTES.dashboard)}>
            Keep my account
          </SecondaryButton>
        </>
      }
    >
      <p>The following data will be permanently removed:</p>
      <ul aria-label="Data to be removed">
        <li>Data categories pending confirmation (OQ-06)</li>
      </ul>
      <TrustSignal />
    </ConfirmationDialog>
  );
}
