import { Link, Outlet } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { ROUTES } from '../routes/paths';
import './layouts.css';

// Pre-auth shell for onboarding, authentication, recovery and post-deletion screens.
export function PreAuthLayout() {
  return (
    <>
      <header className="ums-header">
        <Link to={ROUTES.login} className="ums-brand" aria-label="UMS home">
          <Shield aria-hidden="true" size={20} />
          <span>UMS</span>
        </Link>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
