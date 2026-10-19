import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const { signInSocial, replace } = vi.hoisted(() => ({
  signInSocial: vi.fn(),
  replace: vi.fn(),
}));

vi.mock('@/lib/auth/auth-client', () => ({
  signIn: { social: signInSocial },
  useSession: () => ({ data: null }),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
}));

import SignInPage from '@/app/(no-auth)/sign-in/page';

describe('Google sign-in page', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('lets the OAuth flow redirect instead of navigating before authentication', async () => {
    signInSocial.mockResolvedValue({ data: { url: 'https://accounts.google.com/' }, error: null });
    render(<SignInPage />);
    await userEvent.click(screen.getByRole('button', { name: 'Login with Google' }));
    expect(signInSocial).toHaveBeenCalledWith({ provider: 'google', callbackURL: '/' });
    expect(replace).not.toHaveBeenCalled();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it.each(['api', 'network'])('shows a retryable error on %s failure', async (failure) => {
    if (failure === 'api') {
      signInSocial.mockResolvedValue({ data: null, error: { message: 'Unavailable' } });
    } else {
      signInSocial.mockRejectedValue(new Error('Network unavailable'));
    }
    render(<SignInPage />);
    await userEvent.click(screen.getByRole('button', { name: 'Login with Google' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Please try again.');
    expect(screen.getByRole('button', { name: 'Login with Google' })).toBeEnabled();
    expect(replace).not.toHaveBeenCalled();
  });
});
