import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../components/Dashboard';

describe('Dashboard Component', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'fakeToken');
  });

  it('renders New Presentation button', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // Check if the New Presentation button is rendered.
    expect(screen.getByRole('button', { name: /New Presentation/i })).toBeInTheDocument();
  });

  it('opens the modal for creating a new presentation', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /New Presentation/i }));

    // heck if the text content in the modal box exists
    expect(screen.getByText(/Create New Presentation/i)).toBeInTheDocument();
  });

  it('allows entering a presentation name and description', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // Open modal box
    fireEvent.click(screen.getByRole('button', { name: /New Presentation/i }));


    const nameInput = screen.getByLabelText(/Presentation Name/i);
    const descriptionInput = screen.getByLabelText(/Description/i);

    fireEvent.change(nameInput, { target: { value: 'Test Presentation' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });


    expect(nameInput.value).toBe('Test Presentation');
    expect(descriptionInput.value).toBe('Test Description');
  });
});
