import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils';
import FormField from '../FormField';

describe('FormField', () => {
  const defaultProps = {
    id: 'test-field',
    name: 'testField',
    type: 'text' as const,
    label: 'Test Label',
    placeholder: 'Test placeholder',
    value: '',
    onChange: vi.fn(),
  };

  it('renders with basic props', () => {
    render(<FormField {...defaultProps} />);
    
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Test placeholder')).toBeInTheDocument();
  });

  it('displays required asterisk when required', () => {
    render(<FormField {...defaultProps} required />);
    
    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();
    // Check if required styling is applied (asterisk is added via CSS)
    expect(label.closest('label')).toHaveAttribute('required');
  });

  it('displays error message', () => {
    const errorMessage = 'This field is required';
    render(<FormField {...defaultProps} error={errorMessage} />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('displays helper text when no error', () => {
    const helperText = 'This is helpful information';
    render(<FormField {...defaultProps} helperText={helperText} />);
    
    expect(screen.getByText(helperText)).toBeInTheDocument();
  });

  it('does not display helper text when error exists', () => {
    const helperText = 'This is helpful information';
    const errorMessage = 'This field is required';
    render(<FormField {...defaultProps} error={errorMessage} helperText={helperText} />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.queryByText(helperText)).not.toBeInTheDocument();
  });

  it('renders with icon', () => {
    render(<FormField {...defaultProps} icon={<div data-testid="test-icon">Icon</div>} />);
    
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('handles onChange event', () => {
    const onChange = vi.fn();
    render(<FormField {...defaultProps} onChange={onChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test value' } });
    
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
      target: expect.objectContaining({ value: 'test value' })
    }));
  });

  it('handles onBlur event', () => {
    const onBlur = vi.fn();
    render(<FormField {...defaultProps} onBlur={onBlur} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.blur(input);
    
    expect(onBlur).toHaveBeenCalled();
  });

  it('renders as readonly when readOnly prop is true', () => {
    render(<FormField {...defaultProps} readOnly />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('readonly');
  });

  it('supports different input types', () => {
    const { rerender } = render(<FormField {...defaultProps} type="email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
    
    rerender(<FormField {...defaultProps} type="password" />);
    expect(screen.getByLabelText('Test Label')).toHaveAttribute('type', 'password');
  });

  it('applies autoComplete attribute', () => {
    render(<FormField {...defaultProps} autoComplete="email" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('autocomplete', 'email');
  });

  it('displays current value', () => {
    render(<FormField {...defaultProps} value="current value" />);
    
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('current value');
  });
});