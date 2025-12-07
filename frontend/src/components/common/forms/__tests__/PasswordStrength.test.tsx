import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/utils';
import PasswordStrength from '../PasswordStrength';

// Mock the validation utility functions
vi.mock('@/utils/validation', () => ({
  calculatePasswordStrength: vi.fn((password: string) => {
    if (!password) return 0;
    if (password.length < 4) return 1;
    if (password.length < 8) return 2;
    if (password.length < 12) return 3;
    return 4;
  }),
  getStrengthLabel: vi.fn((strength: number) => {
    const labels = ['Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    return labels[strength] || 'Weak';
  }),
  getPasswordRequirements: vi.fn((password: string) => [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(password) },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Contains number', met: /\d/.test(password) },
    { label: 'Contains special character (@$!%*?&)', met: /[@$!%*?&]/.test(password) }
  ])
}));

describe('PasswordStrength', () => {
  it('returns null for empty password', () => {
    const { container } = render(<PasswordStrength password="" />);
    expect(container.firstChild).toBeNull();
  });

  it('displays password strength for weak password', () => {
    render(<PasswordStrength password="123" />);
    
    expect(screen.getByText('Password strength: Weak')).toBeInTheDocument();
  });

  it('displays password strength for strong password', () => {
    render(<PasswordStrength password="StrongPassword123!" />);
    
    expect(screen.getByText('Password strength: Strong')).toBeInTheDocument();
  });

  it('shows requirements by default', () => {
    render(<PasswordStrength password="test" />);
    
    expect(screen.getByText('At least 8 characters')).toBeInTheDocument();
    expect(screen.getByText('Contains lowercase letter')).toBeInTheDocument();
    expect(screen.getByText('Contains uppercase letter')).toBeInTheDocument();
    expect(screen.getByText('Contains number')).toBeInTheDocument();
    expect(screen.getByText('Contains special character (@$!%*?&)')).toBeInTheDocument();
  });

  it('hides requirements when showDetails is false', () => {
    render(<PasswordStrength password="test" showDetails={false} />);
    
    expect(screen.getByText('Password strength: Weak')).toBeInTheDocument();
    expect(screen.queryByText('At least 8 characters')).not.toBeInTheDocument();
  });

  it('shows met and unmet requirements correctly', () => {
    render(<PasswordStrength password="Test123!" />);
    
    // This password should meet most requirements
    const requirements = screen.getAllByText(/Contains|At least/);
    expect(requirements.length).toBeGreaterThan(0);
  });

  it('displays progress bar', () => {
    const { container } = render(<PasswordStrength password="test123" />);
    
    // Check for progress bar elements
    const progressBars = container.querySelectorAll('[class*="ProgressBar"]');
    expect(progressBars.length).toBeGreaterThan(0);
  });

  it('renders with different password strengths', () => {
    const { rerender } = render(<PasswordStrength password="a" />);
    expect(screen.getByText(/Weak/)).toBeInTheDocument();
    
    rerender(<PasswordStrength password="abc123" />);
    expect(screen.getByText(/Fair/)).toBeInTheDocument();
    
    rerender(<PasswordStrength password="TestPass123" />);
    expect(screen.getByText(/Good/)).toBeInTheDocument();
    
    rerender(<PasswordStrength password="VeryStrongPass123!" />);
    expect(screen.getByText(/Strong/)).toBeInTheDocument();
  });

  it('handles special characters in requirements', () => {
    render(<PasswordStrength password="Test123@" />);
    
    expect(screen.getByText('Contains special character (@$!%*?&)')).toBeInTheDocument();
  });
});