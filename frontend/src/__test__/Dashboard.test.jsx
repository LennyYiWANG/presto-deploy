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

    // 检查是否渲染了 New Presentation 按钮
    expect(screen.getByRole('button', { name: /New Presentation/i })).toBeInTheDocument();
  });

  it('opens the modal for creating a new presentation', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // 点击按钮打开模态框
    fireEvent.click(screen.getByRole('button', { name: /New Presentation/i }));

    // 检查模态框中的文本内容是否存在
    expect(screen.getByText(/Create New Presentation/i)).toBeInTheDocument();
  });

  it('allows entering a presentation name and description', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // 打开模态框
    fireEvent.click(screen.getByRole('button', { name: /New Presentation/i }));

    // 输入演示名称和描述
    const nameInput = screen.getByLabelText(/Presentation Name/i);
    const descriptionInput = screen.getByLabelText(/Description/i);

    fireEvent.change(nameInput, { target: { value: 'Test Presentation' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });

    // 验证输入值
    expect(nameInput.value).toBe('Test Presentation');
    expect(descriptionInput.value).toBe('Test Description');
  });
});
