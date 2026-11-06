import { useId, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ChevronDown, Home, LogOut, Shield, Trash2, User } from 'lucide-react';
import { useSession } from '../auth/session';
import { ROUTES } from '../routes/paths';
import './layouts.css';

// Post-auth shell (references/navigation.md):
// UMS, Dashboard -> SCR-005, Account -> Delete Account -> SCR-006, Sign Out -> SCR-004.
export function PostAuthLayout() {
  const { signOut } = useSession();
  const navigate = useNavigate();
  const [accountOpen, setAccountOpen] = useState(false);
  const accountMenuId = useId();

  const handleSignOut = () => {
    // TODO(F-02): call umsApi.logout() for server-side session invalidation.
    signOut();
    navigate(ROUTES.login, { replace: true });
  };

  return (
    <>
      <header className="ums-header">
        <Link to={ROUTES.dashboard} className="ums-brand" aria-label="UMS home">
          <Shield aria-hidden="true" size={20} />
          <span>UMS</span>
        </Link>
        <nav aria-label="Primary">
          <ul className="ums-nav">
            <li className="ums-nav-item">
              <NavLink to={ROUTES.dashboard} end className="ums-nav-link">
                <Home aria-hidden="true" size={18} />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li className="ums-nav-item">
              <button
                type="button"
                className="ums-nav-link"
                aria-haspopup="true"
                aria-expanded={accountOpen}
                aria-controls={accountMenuId}
                onClick={() => setAccountOpen((open) => !open)}
              >
                <User aria-hidden="true" size={18} />
                <span>Account</span>
                <ChevronDown aria-hidden="true" size={16} />
              </button>
              {accountOpen && (
                <ul id={accountMenuId} className="ums-nav-menu">
                  <li>
                    <Link
                      to={ROUTES.deleteAccount}
                      className="ums-nav-link"
                      onClick={() => setAccountOpen(false)}
                    >
                      <Trash2 aria-hidden="true" size={18} />
                      <span>Delete Account</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li className="ums-nav-item">
              <button type="button" className="ums-nav-link" onClick={handleSignOut}>
                <LogOut aria-hidden="true" size={18} />
                <span>Sign Out</span>
              </button>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
