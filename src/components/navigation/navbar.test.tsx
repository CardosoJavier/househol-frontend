import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom';
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import Navbar from './navbar';
import { useAuth, useColumns } from '../../context';
import { showToast } from '../notifications/CustomToast';

// Mock the hooks and modules
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => children,
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock('../../context', () => ({
  useAuth: jest.fn(),
  useColumns: jest.fn(),
}));

jest.mock('../notifications/CustomToast', () => ({
  showToast: jest.fn(),
}));

describe('Navbar', () => {
  const mockNavigate = jest.fn();
  const mockLogOut = jest.fn().mockImplementation(() => Promise.resolve()) as jest.MockedFunction<() => Promise<void>>;
  const mockSetColumns = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useLocation as jest.Mock).mockReturnValue({ pathname: '/' });
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useAuth as jest.Mock).mockReturnValue({ logOut: mockLogOut });
    (useColumns as jest.Mock).mockReturnValue({ setColumns: mockSetColumns });
  });

  it('renders correctly with all navigation links', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getAllByText('Projects')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Settings')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Log out')[0]).toBeInTheDocument();
  });

  it('highlights active link based on current route', () => {
    (useLocation as jest.Mock).mockReturnValue({ pathname: '/profile' });

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    const projectsButton = screen.getAllByText('Projects')[0].closest('button');
    const settingsButton = screen.getAllByText('Settings')[0].closest('button');

    expect(projectsButton).toHaveClass('bg-transparent');
    expect(settingsButton).not.toHaveClass('bg-transparent');
  });

  it('navigates when clicking nav links', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    fireEvent.click(screen.getAllByText('Settings')[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/profile');
  });

  it('handles logout process correctly', async () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    const logoutButton = screen.getAllByText('Log out')[0];
    fireEvent.click(logoutButton);

    expect(mockSetColumns).toHaveBeenCalledWith([]);
    expect(mockLogOut).toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.queryByText('Logging out...')).not.toBeInTheDocument();
    });
  });

  it('handles logout error correctly', async () => {
    const error = new Error('Logout failed');
    mockLogOut.mockRejectedValueOnce(error);
    (showToast as jest.Mock).mockClear();

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    const logoutButton = screen.getAllByText('Log out')[0];
    await fireEvent.click(logoutButton);

    expect(mockLogOut).toHaveBeenCalled();
    expect(mockSetColumns).toHaveBeenCalledWith([]);
    
    expect(showToast).toHaveBeenCalledWith(
        'An unexpected error occurred. Please try again.',
        'error'
      );
  });

  it('toggles mobile menu correctly', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    // Initial state - menu should be closed
    const mobileSidebar = screen.getByTestId('mobile-sidebar');
    expect(mobileSidebar).toHaveClass('-translate-x-full');
    expect(screen.queryByTestId('mobile-overlay')).not.toBeInTheDocument();

    // Open menu
    const menuButton = screen.getByLabelText('menu');
    fireEvent.click(menuButton);
    
    // Verify menu is open and find close button
    expect(mobileSidebar).toHaveClass('translate-x-0');
    const closeButton = within(mobileSidebar).getByTestId('close-button-container');
    fireEvent.click(closeButton);
    
    // Verify menu is closed
    expect(mobileSidebar).toHaveClass('-translate-x-full');
    expect(screen.queryByTestId('mobile-overlay')).not.toBeInTheDocument();
  });

  it('closes mobile menu when clicking overlay', async () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    // Open menu
    fireEvent.click(screen.getByLabelText(/menu/i));
    expect(screen.getByRole('complementary')).toBeInTheDocument();

    // Click overlay
    const overlay = screen.getByTestId('mobile-overlay');
    fireEvent.click(overlay);

    await waitFor(() => {
      expect(screen.queryByTestId('mobile-overlay')).not.toBeInTheDocument();
    });
  });
});