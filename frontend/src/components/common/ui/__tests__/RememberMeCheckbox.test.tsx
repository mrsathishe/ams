import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils';
import RememberMeCheckbox from '../RememberMeCheckbox';

describe('RememberMeCheckbox', () => {
  const defaultProps = {
    checked: false,
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with correct label', () => {
    render(<RememberMeCheckbox {...defaultProps} />);
    
    expect(screen.getByLabelText('Remember me')).toBeInTheDocument();
    expect(screen.getByText('Remember me')).toBeInTheDocument();
  });

  it('renders checkbox as unchecked by default', () => {
    render(<RememberMeCheckbox {...defaultProps} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('renders checkbox as checked when checked prop is true', () => {
    render(<RememberMeCheckbox {...defaultProps} checked={true} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('calls onChange with correct value when clicked', () => {
    const onChange = vi.fn();
    render(<RememberMeCheckbox {...defaultProps} onChange={onChange} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('calls onChange with false when unchecking', () => {
    const onChange = vi.fn();
    render(<RememberMeCheckbox {...defaultProps} checked={true} onChange={onChange} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('has correct accessibility attributes', () => {
    render(<RememberMeCheckbox {...defaultProps} />);
    
    const checkbox = screen.getByRole('checkbox');
    const label = screen.getByLabelText('Remember me');
    
    expect(checkbox).toHaveAttribute('id', 'rememberMe');
    expect(label).toHaveAttribute('for', 'rememberMe');
  });

  it('can be toggled by clicking the label', () => {
    const onChange = vi.fn();
    render(<RememberMeCheckbox {...defaultProps} onChange={onChange} />);
    
    const label = screen.getByText('Remember me');
    fireEvent.click(label);
    
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('maintains proper focus behavior', () => {
    render(<RememberMeCheckbox {...defaultProps} />);
    
    const checkbox = screen.getByRole('checkbox');
    checkbox.focus();
    
    expect(checkbox).toHaveFocus();
  });

  it('handles keyboard interaction', () => {
    const onChange = vi.fn();
    render(<RememberMeCheckbox {...defaultProps} onChange={onChange} />);
    
    const checkbox = screen.getByRole('checkbox');
    checkbox.focus();
    fireEvent.keyDown(checkbox, { key: ' ', code: 'Space' });
    
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('has proper checkbox wrapper structure', () => {
    const { container } = render(<RememberMeCheckbox {...defaultProps} />);
    
    expect(container.querySelector('input[type="checkbox"]')).toBeInTheDocument();
    expect(container.querySelector('label')).toBeInTheDocument();
  });

  it('updates correctly when checked state changes', () => {
    const { rerender } = render(<RememberMeCheckbox {...defaultProps} checked={false} />);
    
    let checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    
    rerender(<RememberMeCheckbox {...defaultProps} checked={true} />);
    
    checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('calls onChange function only once per click', () => {
    const onChange = vi.fn();
    render(<RememberMeCheckbox {...defaultProps} onChange={onChange} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});