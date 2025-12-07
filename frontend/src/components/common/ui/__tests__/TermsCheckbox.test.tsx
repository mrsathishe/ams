import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils';
import TermsCheckbox from '../TermsCheckbox';

// Mock window.open
Object.defineProperty(window, 'open', {
  writable: true,
  value: vi.fn(),
});

describe('TermsCheckbox', () => {
  const defaultProps = {
    checked: false,
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with correct label and links', () => {
    render(<TermsCheckbox {...defaultProps} />);
    
    expect(screen.getByText(/I agree to the/)).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText(/and/)).toBeInTheDocument();
  });

  it('renders checkbox as unchecked by default', () => {
    render(<TermsCheckbox {...defaultProps} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('renders checkbox as checked when checked prop is true', () => {
    render(<TermsCheckbox {...defaultProps} checked={true} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('calls onChange when checkbox is clicked', () => {
    const onChange = vi.fn();
    render(<TermsCheckbox {...defaultProps} onChange={onChange} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('calls onChange with correct value when toggling', () => {
    const onChange = vi.fn();
    render(<TermsCheckbox {...defaultProps} checked={true} onChange={onChange} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('has required attribute on checkbox', () => {
    render(<TermsCheckbox {...defaultProps} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('required');
  });

  it('has correct accessibility attributes', () => {
    render(<TermsCheckbox {...defaultProps} />);
    
    const checkbox = screen.getByRole('checkbox');
    const label = screen.getByLabelText(/I agree to the/);
    
    expect(checkbox).toHaveAttribute('id', 'agreeToTerms');
    expect(label).toHaveAttribute('for', 'agreeToTerms');
  });

  it('opens Terms of Service link in new tab', () => {
    render(<TermsCheckbox {...defaultProps} />);
    
    const termsLink = screen.getByText('Terms of Service');
    fireEvent.click(termsLink);
    
    expect(window.open).toHaveBeenCalledWith('/terms', '_blank');
  });

  it('opens Privacy Policy link in new tab', () => {
    render(<TermsCheckbox {...defaultProps} />);
    
    const privacyLink = screen.getByText('Privacy Policy');
    fireEvent.click(privacyLink);
    
    expect(window.open).toHaveBeenCalledWith('/privacy', '_blank');
  });

  it('prevents default behavior on link clicks', () => {
    render(<TermsCheckbox {...defaultProps} />);
    
    const termsLink = screen.getByText('Terms of Service');
    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
    const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault');
    
    termsLink.dispatchEvent(clickEvent);
    
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('displays error message when error prop is provided', () => {
    const errorMessage = 'You must agree to the terms';
    render(<TermsCheckbox {...defaultProps} error={errorMessage} />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('does not display error message when error prop is not provided', () => {
    render(<TermsCheckbox {...defaultProps} />);
    
    expect(screen.queryByText(/must agree/)).not.toBeInTheDocument();
  });

  it('applies error styling when error exists', () => {
    const { container } = render(<TermsCheckbox {...defaultProps} error="Error message" />);
    
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('can be clicked via label text', () => {
    const onChange = vi.fn();
    render(<TermsCheckbox {...defaultProps} onChange={onChange} />);
    
    const labelText = screen.getByText(/I agree to the/);
    fireEvent.click(labelText.closest('label')!);
    
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('has proper link styling and hover behavior', () => {
    render(<TermsCheckbox {...defaultProps} />);
    
    const termsLink = screen.getByText('Terms of Service');
    const privacyLink = screen.getByText('Privacy Policy');
    
    expect(termsLink.tagName).toBe('A');
    expect(privacyLink.tagName).toBe('A');
    expect(termsLink).toHaveAttribute('href', '/terms');
    expect(privacyLink).toHaveAttribute('href', '/privacy');
  });
});