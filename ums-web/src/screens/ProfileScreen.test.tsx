import { render, screen, waitFor } from '@testing-library/react';
import { type AxiosResponse } from 'axios';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { umsApi } from '../api/endpoints';
import { SessionProvider } from '../auth/SessionContext';
import { AppRoutes } from '../routes/AppRoutes';
import { ROUTES } from '../routes/paths';

vi.mock('../api/endpoints', () => ({
  umsApi: { getProfile: vi.fn(), getDashboard: vi.fn(), deleteAccount: vi.fn() },
}));

const getProfile = vi.mocked(umsApi.getProfile);

const user = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  created_at: '2026-01-02T03:04:05.000Z',
  account_status: 'ACTIVE',
};

function renderProfile() {
  return render(
    <MemoryRouter initialEntries={[ROUTES.profile]}>
      <SessionProvider initialAuthenticated>
        <AppRoutes />
      </SessionProvider>
    </MemoryRouter>,
  );
}

describe('US-005 profile page', () => {
  beforeEach(() => {
    getProfile.mockReset();
    getProfile.mockResolvedValue({ status: 200, data: { user } } as AxiosResponse);
  });

  it('[US-005-AC1] renders the User Details (Read Only) heading as a semantic heading', async () => {
    renderProfile();
    expect(
      await screen.findByRole('heading', { level: 2, name: 'User Details (Read Only)' }),
    ).toBeInTheDocument();
  });

  it('[US-005-AC2][US-005-AC5] shows name, email, registration date and status from the API', async () => {
    renderProfile();
    await waitFor(() => expect(screen.getByText('Ada Lovelace')).toBeInTheDocument());
    expect(screen.getByText('ada@example.com')).toBeInTheDocument();
    expect(screen.getByText('ACTIVE')).toBeInTheDocument();
    expect(screen.getByText(new Date(user.created_at).toLocaleDateString())).toBeInTheDocument();
    for (const label of ['Name', 'Email Address', 'Registration Date', 'Account Status']) {
      expect(screen.getByText(label).tagName).toBe('DT');
    }
  });

  it('[US-005-AC3] renders no inputs, edit buttons or save controls', async () => {
    renderProfile();
    await screen.findByText('Ada Lovelace');
    expect(screen.queryAllByRole('textbox')).toHaveLength(0);
    expect(screen.queryByRole('button', { name: /edit|save/i })).toBeNull();
    expect(document.querySelectorAll('input, textarea, select')).toHaveLength(0);
  });
});
