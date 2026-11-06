import { render, screen, waitFor } from '@testing-library/react';
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

const body = {
  user: {
    id: 'u1',
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    is_verified: true,
    created_at: '2026-03-04T10:00:00.000Z',
  },
  features: { delete_account_visible: true },
};

function renderProfile(authenticated = true) {
  return render(
    <MemoryRouter initialEntries={[ROUTES.profile]}>
      <SessionProvider initialAuthenticated={authenticated}>
        <AppRoutes />
      </SessionProvider>
    </MemoryRouter>,
  );
}

describe('US-017 read-only profile page', () => {
  beforeEach(() => {
    getDashboard.mockReset();
    getDashboard.mockResolvedValue({ status: 200, data: body } as AxiosResponse);
  });

  it('[US-017-AC1] displays Name, Email Address, Registration Date and Account Status', async () => {
    renderProfile();
    expect(await screen.findByText('Ada Lovelace')).toBeInTheDocument();
    expect(screen.getByText('ada@example.com')).toBeInTheDocument();
    expect(screen.getByText('March 4, 2026')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('[US-017-AC2] pairs each value with a visible, programmatically associated label', async () => {
    renderProfile();
    await screen.findByText('Ada Lovelace');
    const expected: Record<string, string> = {
      Name: 'Ada Lovelace',
      'Email Address': 'ada@example.com',
      'Registration Date': 'March 4, 2026',
      'Account Status': 'Active',
    };
    for (const [label, value] of Object.entries(expected)) {
      expect(screen.getByText(label)).toBeVisible();
      expect(screen.getByText(value)).toHaveAccessibleName(label);
    }
  });

  it('[US-017-AC3] renders zero editable controls', async () => {
    renderProfile();
    await screen.findByText('Ada Lovelace');
    const main = screen.getByRole('main');
    expect(
      main.querySelectorAll('input, select, textarea, [contenteditable], [role="textbox"]'),
    ).toHaveLength(0);
    expect(screen.queryByRole('textbox')).toBeNull();
    expect(screen.queryByRole('combobox')).toBeNull();
    expect(screen.queryByRole('checkbox')).toBeNull();
  });

  it('[US-017-AC4] fetches the profile through the JSON REST API client', async () => {
    renderProfile();
    await screen.findByText('Ada Lovelace');
    expect(getDashboard).toHaveBeenCalledTimes(1);
    const actual = await vi.importActual<typeof import('../api/endpoints')>('../api/endpoints');
    const get = vi.fn().mockResolvedValue({});
    const client = await import('../api/client');
    vi.spyOn(client, 'getApiClient').mockReturnValue({ get } as never);
    await actual.umsApi.getDashboard();
    expect(get).toHaveBeenCalledWith('/api/dashboard');
  });

  it('[US-017-AC5] redirects to Login on 401 and shows no profile data', async () => {
    getDashboard.mockReset();
    getDashboard.mockRejectedValue(
      new AxiosError('Unauthorized', 'ERR_BAD_REQUEST', undefined, undefined, {
        status: 401,
      } as AxiosResponse),
    );
    renderProfile();
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Sign in' }),
    ).toBeInTheDocument();
    expect(screen.queryByText('Ada Lovelace')).toBeNull();
  });

  it('[US-017-AC5] makes no call and shows no data without a session', () => {
    renderProfile(false);
    expect(getDashboard).not.toHaveBeenCalled();
    expect(screen.queryByText('Ada Lovelace')).toBeNull();
  });

  it('[US-017-AC6] offers no way to modify a field value', async () => {
    renderProfile();
    const value = await screen.findByText('Ada Lovelace');
    expect(value).not.toHaveAttribute('contenteditable');
    expect(value.closest('form')).toBeNull();
    expect(screen.queryByRole('button', { name: /edit|save|update/i })).toBeNull();
  });

  it('shows an error banner when loading fails', async () => {
    getDashboard.mockReset();
    getDashboard.mockRejectedValue(new AxiosError('boom', 'ERR_NETWORK'));
    renderProfile();
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
  });
});
