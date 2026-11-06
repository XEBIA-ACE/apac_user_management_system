import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AxiosError, type AxiosResponse } from 'axios';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { umsApi } from '../api/endpoints';
import { SessionProvider } from '../auth/SessionContext';
import { AppRoutes } from '../routes/AppRoutes';
import { ROUTES } from '../routes/paths';

vi.mock('../api/endpoints', () => ({
  umsApi: { getDashboard: vi.fn(), deleteAccount: vi.fn() },
}));

const getDashboard = vi.mocked(umsApi.getDashboard);

function renderDashboard(authenticated: boolean) {
  return render(
    <MemoryRouter initialEntries={[ROUTES.dashboard]}>
      <SessionProvider initialAuthenticated={authenticated}>
        <AppRoutes />
      </SessionProvider>
    </MemoryRouter>,
  );
}

function unauthorized() {
  return new AxiosError('Unauthorized', 'ERR_BAD_REQUEST', undefined, undefined, {
    status: 401,
  } as AxiosResponse);
}

const dashboardDeleteLink = () =>
  screen
    .queryAllByRole('link', { name: 'Delete Account' })
    .find((el) => el.closest('main, section') !== null && el.closest('nav') === null) ?? null;

describe('US-001 dashboard Delete Account entry point', () => {
  beforeEach(() => {
    getDashboard.mockReset();
  });

  // [US-001-AC1] visible and interactable with a valid session
  it('[US-001-AC1] renders an interactable Delete Account entry point for a valid session', async () => {
    getDashboard.mockResolvedValue({ status: 200, data: {} } as AxiosResponse);
    renderDashboard(true);
    await waitFor(() => expect(dashboardDeleteLink()).toBeInTheDocument());
    expect(dashboardDeleteLink()).toHaveAttribute('href', ROUTES.deleteAccount);
  });

  // [US-001-AC2] GET /api/dashboard gates rendering
  it('[US-001-AC2] calls GET /api/dashboard and hides the entry point until it succeeds', async () => {
    let resolve: (value: AxiosResponse) => void = () => undefined;
    getDashboard.mockReturnValue(new Promise<AxiosResponse>((r) => (resolve = r)));
    renderDashboard(true);
    expect(getDashboard).toHaveBeenCalledTimes(1);
    expect(dashboardDeleteLink()).toBeNull();
    resolve({ status: 200, data: {} } as AxiosResponse);
    await waitFor(() => expect(dashboardDeleteLink()).toBeInTheDocument());
  });

  it('[US-001-AC2] does not render the entry point on a non-401 failure', async () => {
    getDashboard.mockRejectedValue(new AxiosError('boom', 'ERR_NETWORK'));
    renderDashboard(true);
    await screen.findByRole('alert');
    expect(dashboardDeleteLink()).toBeNull();
  });

  // [US-001-AC3] no session: redirect to /login, never render the entry point
  it('[US-001-AC3] redirects to Login without a session and never renders the entry point', () => {
    renderDashboard(false);
    expect(screen.getByRole('heading', { level: 1, name: 'Sign in' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Delete Account' })).toBeNull();
    expect(getDashboard).not.toHaveBeenCalled();
  });

  // [US-001-AC4] expired session: 401 -> redirect, entry point suppressed
  it('[US-001-AC4] redirects to Login on 401 and suppresses the entry point', async () => {
    getDashboard.mockRejectedValue(unauthorized());
    renderDashboard(true);
    expect(dashboardDeleteLink()).toBeNull();
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Sign in' }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Delete Account' })).toBeNull();
  });

  // [US-001-AC5] design-system component, wireframe placement and labeling
  it('[US-001-AC5] renders the entry point as a design-system link in the Danger Zone', async () => {
    getDashboard.mockResolvedValue({ status: 200, data: {} } as AxiosResponse);
    renderDashboard(true);
    const link = await waitFor(() => {
      const el = dashboardDeleteLink();
      expect(el).not.toBeNull();
      return el as HTMLElement;
    });
    expect(link).toHaveClass('ums-link');
    const section = screen.getByRole('region', { name: 'Danger Zone' });
    expect(section).toHaveClass('ums-dashboard-section--danger');
    expect(section).toContainElement(link);
  });

  // [US-001-AC6] wired to initiate the delete flow (DELETE /api/users/me consumer)
  it('[US-001-AC6] initiates the delete-account flow when activated', async () => {
    getDashboard.mockResolvedValue({ status: 200, data: {} } as AxiosResponse);
    const user = userEvent.setup();
    renderDashboard(true);
    const link = await waitFor(() => {
      const el = dashboardDeleteLink();
      expect(el).not.toBeNull();
      return el as HTMLElement;
    });
    await user.click(link);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Delete your account' }),
    ).toBeInTheDocument();
  });

  it('[US-001-AC6] lists DELETE /api/users/me as a consumed API', async () => {
    const actual = await vi.importActual<typeof import('../api/endpoints')>('../api/endpoints');
    const del = vi.fn().mockResolvedValue({});
    const client = await import('../api/client');
    vi.spyOn(client, 'getApiClient').mockReturnValue({ delete: del } as never);
    await actual.umsApi.deleteAccount();
    expect(del).toHaveBeenCalledWith('/api/users/me');
  });
});
