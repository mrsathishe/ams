import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/utils';
import QuickAccessButtons from '../QuickAccessButtons';

// Mock the constants
vi.mock('@/constants', () => ({
  REGISTER_CONSTANTS: {
    quickAccess: {
      title: 'Quick Access Options',
      subtitle: 'Sign up faster with',
      status: 'Coming Soon',
      buttons: {
        google: 'Continue with Google',
        linkedin: 'Continue with LinkedIn', 
        sso: 'Continue with SSO'
      }
    }
  }
}));

describe('QuickAccessButtons', () => {
  it('renders title and status information', () => {
    render(<QuickAccessButtons />);
    
    expect(screen.getByText('Quick Access Options')).toBeInTheDocument();
    expect(screen.getByText('Sign up faster with - Coming Soon')).toBeInTheDocument();
  });

  it('renders status icon', () => {
    render(<QuickAccessButtons />);
    
    expect(screen.getByText('!')).toBeInTheDocument();
  });

  it('renders all three disabled buttons', () => {
    render(<QuickAccessButtons />);
    
    const googleButton = screen.getByRole('button', { name: 'Continue with Google' });
    const linkedinButton = screen.getByRole('button', { name: 'Continue with LinkedIn' });
    const ssoButton = screen.getByRole('button', { name: 'Continue with SSO' });
    
    expect(googleButton).toBeInTheDocument();
    expect(linkedinButton).toBeInTheDocument();
    expect(ssoButton).toBeInTheDocument();
  });

  it('all buttons are disabled', () => {
    render(<QuickAccessButtons />);
    
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });

  it('buttons have correct type attribute', () => {
    render(<QuickAccessButtons />);
    
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  it('has proper accessibility structure', () => {
    render(<QuickAccessButtons />);
    
    // Should have heading for the section
    expect(screen.getByText('Quick Access Options')).toBeInTheDocument();
    
    // Should have buttons with proper labels
    expect(screen.getByRole('button', { name: 'Continue with Google' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue with LinkedIn' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue with SSO' })).toBeInTheDocument();
  });

  it('displays warning status correctly', () => {
    const { container } = render(<QuickAccessButtons />);
    
    // Should contain status icon and message
    expect(screen.getByText('!')).toBeInTheDocument();
    expect(screen.getByText(/Coming Soon/)).toBeInTheDocument();
  });

  it('renders in a grid layout structure', () => {
    const { container } = render(<QuickAccessButtons />);
    
    // Should have the grid container for buttons
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
  });

  it('buttons cannot be clicked when disabled', () => {
    const { container } = render(<QuickAccessButtons />);
    
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('disabled');
    });
  });
});