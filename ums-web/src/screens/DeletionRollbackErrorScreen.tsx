import { useNavigate } from 'react-router-dom';
import { FormCard, NotificationBanner, PrimaryButton, TextLink } from '../components';
import { ROUTES } from '../routes/paths';

// SCR-009 Deletion Rollback Error Screen (J-03, F-03, F-05). Placeholder only.
export function DeletionRollbackErrorScreen() {
  const navigate = useNavigate();
  return (
    <FormCard heading="Account deletion could not be completed">
      <NotificationBanner variant="error">
        A system error occurred. Your account is intact and no data was deleted.
      </NotificationBanner>
      <div className="ums-actions">
        <PrimaryButton onClick={() => navigate(ROUTES.deleteAccount)}>Try again</PrimaryButton>
        <TextLink to={ROUTES.dashboard}>Back to Dashboard</TextLink>
      </div>
    </FormCard>
  );
}
