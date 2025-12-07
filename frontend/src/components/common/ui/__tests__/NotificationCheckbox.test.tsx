import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils';
import NotificationCheckbox from '../NotificationCheckbox';

describe('NotificationCheckbox', () => {
  const defaultProps = {
    checked: false,
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with correct label and description', () => {
    render(<NotificationCheckbox {...defaultProps} />);
    
    expect(screen.getByLabelText('Send me notifications and updates')).toBeInTheDocument();
    expect(screen.getByText('Get important updates about your apartment, payments, and maintenance schedules.')).toBeInTheDocument();
  });

  it('renders checkbox as unchecked by default', () => {
    render(<NotificationCheckbox {...defaultProps} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('renders checkbox as checked when checked prop is true', () => {
    render(<NotificationCheckbox {...defaultProps} checked={true} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('calls onChange when checkbox is clicked', () => {
    const onChange = vi.fn();
    render(<NotificationCheckbox {...defaultProps} onChange={onChange} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('calls onChange with correct value when toggling', () => {
    const onChange = vi.fn();
    render(<NotificationCheckbox {...defaultProps} checked={true} onChange={onChange} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('has correct accessibility attributes', () => {
    render(<NotificationCheckbox {...defaultProps} />);
    
    const checkbox = screen.getByRole('checkbox');
    const label = screen.getByLabelText('Send me notifications and updates');
    
    expect(checkbox).toHaveAttribute('id', 'subscribeToNotifications');
    expect(label).toHaveAttribute('for', 'subscribeToNotifications');
  });

  it('can be clicked via label', () => {
    const onChange = vi.fn();
    render(<NotificationCheckbox {...defaultProps} onChange={onChange} />);
    
    const label = screen.getByText('Send me notifications and updates');
    fireEvent.click(label);
    
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('has proper structure with container and content', () => {
    const { container } = render(<NotificationCheckbox {...defaultProps} />);
    
    // Should have a container with checkbox and content div
    expect(container.querySelector('input[type="checkbox"]')).toBeInTheDocument();
    expect(container.querySelector('div')).toBeInTheDocument();
  });

  it('maintains focus management', () => {
    render(<NotificationCheckbox {...defaultProps} />);
    
    const checkbox = screen.getByRole('checkbox');
    checkbox.focus();
    
    expect(checkbox).toHaveFocus();
  });
});