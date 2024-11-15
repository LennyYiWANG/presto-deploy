import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // 引入 MemoryRouter
import Logout from '../components/Logout';

describe('Logout Component', () => {
  const mockSetToken = vi.fn();

  it('renders correctly when token is provided', () => {
    render(
      <MemoryRouter>
        <Logout token="dummy-token" setToken={mockSetToken} userName="TestUser" />
      </MemoryRouter>
    );
    expect(screen.getByText('Welcome, TestUser!')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('does not render when token is not provided', () => {
    render(
      <MemoryRouter>
        <Logout token={null} setToken={mockSetToken} userName="TestUser" />
      </MemoryRouter>
    );
    expect(screen.queryByText('Welcome, TestUser!')).not.toBeInTheDocument();
  });

  it('calls setToken when logout button is clicked', () => {
    render(
      <MemoryRouter>
        <Logout token="dummy-token" setToken={mockSetToken} userName="TestUser" />
      </MemoryRouter>
    );
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    expect(mockSetToken).toHaveBeenCalledWith(null);
  });
});
