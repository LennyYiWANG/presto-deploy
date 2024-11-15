import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SignInForm from '../components/SigninForm';

describe('SignInForm Component', () => {
  const mockSetToken = vi.fn();

  beforeEach(() => {
    mockSetToken.mockClear();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('renders the form and elements correctly', () => {
    render(
      <MemoryRouter>
        <SignInForm setToken={mockSetToken} />
      </MemoryRouter>
    );

    expect(screen.getByText('Welcome back!')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Log in/i })).toBeInTheDocument();
  });

  it('displays an error message on failed login', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ message: 'Invalid input. Please check your email and password.' })
    });

    render(
      <MemoryRouter>
        <SignInForm setToken={mockSetToken} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /Log in/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid input. Please check your email and password.')).toBeInTheDocument();
    });
  });

  it('calls setToken and navigates on successful login', async () => {
    const fakeToken = 'fake-jwt-token';
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: fakeToken })
    });

    render(
      <MemoryRouter>
        <SignInForm setToken={mockSetToken} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /Log in/i }));

    await waitFor(() => {
      expect(mockSetToken).toHaveBeenCalledWith(fakeToken);
      expect(screen.getByText('Login successful! Redirecting...')).toBeInTheDocument();
    }, { timeout: 2000 });  
  });
});
