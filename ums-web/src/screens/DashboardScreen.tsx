import { DashboardSection, TextLink, TrustSignal } from '../components';
import { ROUTES } from '../routes/paths';

// SCR-005 Dashboard Screen (J-02, J-03, F-02, F-03, F-05). Placeholder only.
// TODO(OQ-05): Session-expiry warning state depends on the TBD session timeout duration.
export function DashboardScreen() {
  return (
    <>
      <div className="ums-dashboard-section">
        <h1>Dashboard</h1>
      </div>
      <DashboardSection heading="Welcome">
        <p>Protected dashboard content will appear here.</p>
        <TrustSignal />
      </DashboardSection>
      <DashboardSection heading="Danger Zone" danger>
        <TextLink to={ROUTES.deleteAccount}>Delete Account</TextLink>
      </DashboardSection>
    </>
  );
}
