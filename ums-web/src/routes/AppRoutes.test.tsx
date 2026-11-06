import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { SessionProvider } from '../auth/SessionContext';
import { AppRoutes } from './AppRoutes';
import { ROUTES } from './paths';

function renderAt(path: string, authenticated = false) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <SessionProvider initialAuthenticated={authenticated}>
        <AppRoutes />
      </SessionProvider>
    </MemoryRouter>,
  );
}

const PUBLIC_SCREENS: Array<[string, string, string]> = [
  ['SCR-001', ROUTES.register, 'Create your account'],
  ['SCR-002', ROUTES.verifyOtp, 'Verify your email'],
  ['SCR-003', ROUTES.verifyOtpSuccess, 'Account activated!'],
  ['SCR-004', ROUTES.login, 'Sign in'],
  ['SCR-007', ROUTES.accountDeleted, 'Your account has been deleted'],
  ['SCR-008', ROUTES.otpRecovery, 'Complete your verification'],
  ['SCR-010', ROUTES.sessionReauth, 'Your session expired — please sign in to continue'],
];

const PROTECTED_SCREENS: Array<[string, string, string]> = [
  ['SCR-005', ROUTES.dashboard, 'Dashboard'],
  ['SCR-006', ROUTES.deleteAccount, 'Delete your account'],
  ['SCR-009', ROUTES.deleteAccountError, 'Account deletion could not be completed'],
];

describe('AC-1: route shell', () => {
  it('redirects the root route to the Login screen', () => {
    renderAt(ROUTES.root);
    expect(screen.getByRole('heading', { level: 1, name: 'Sign in' })).toBeInTheDocument();
  });

  it.each(PUBLIC_SCREENS)('%s (%s) renders its placeholder', (_id, path, heading) => {
    renderAt(path);
    expect(screen.getByRole('heading', { level: 1, name: heading })).toBeInTheDocument();
  });

  it.each(PROTECTED_SCREENS)(
    '%s (%s) renders its placeholder for an authenticated session',
    (_id, path, heading) => {
      renderAt(path, true);
      expect(screen.getByRole('heading', { level: 1, name: heading })).toBeInTheDocument();
      expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument();
    },
  );

  it.each(PROTECTED_SCREENS)('%s (%s) redirects to Login without a session', (_id, path) => {
    renderAt(path, false);
    expect(screen.getByRole('heading', { level: 1, name: 'Sign in' })).toBeInTheDocument();
  });

  it('post-auth navigation exposes Dashboard, Account > Delete Account and Sign Out', async () => {
    const user = userEvent.setup();
    renderAt(ROUTES.dashboard, true);
    const nav = screen.getByRole('navigation', { name: 'Primary' });
    expect(nav).toHaveTextContent('Dashboard');

    await user.click(within(nav).getByRole('button', { name: 'Account' }));
    await user.click(within(nav).getByRole('link', { name: 'Delete Account' }));
    expect(
      screen.getByRole('heading', { level: 1, name: 'Delete your account' }),
    ).toBeInTheDocument();

    await user.click(within(nav).getByRole('button', { name: 'Sign Out' }));
    expect(screen.getByRole('heading', { level: 1, name: 'Sign in' })).toBeInTheDocument();
  });

  it('disabled buttons use aria-disabled rather than the disabled attribute', () => {
    renderAt(ROUTES.deleteAccount, true);
    const button = screen.getByRole('button', { name: 'Delete my account' });
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).not.toHaveAttribute('disabled');
  });
});
