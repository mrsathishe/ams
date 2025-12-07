import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import FormSection from '../FormSection';

describe('FormSection', () => {
  it('renders with title and children', () => {
    render(
      <FormSection title="Test Section">
        <div>Test content</div>
      </FormSection>
    );
    
    expect(screen.getByText('Test Section')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders with title and description', () => {
    const description = 'This is a test section description';
    render(
      <FormSection title="Test Section" description={description}>
        <div>Test content</div>
      </FormSection>
    );
    
    expect(screen.getByText('Test Section')).toBeInTheDocument();
    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it('renders without description when not provided', () => {
    render(
      <FormSection title="Test Section">
        <div>Test content</div>
      </FormSection>
    );
    
    expect(screen.getByText('Test Section')).toBeInTheDocument();
    expect(screen.queryByText(/description/i)).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <FormSection title="Test Section" className="custom-class">
        <div>Test content</div>
      </FormSection>
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders multiple children correctly', () => {
    render(
      <FormSection title="Test Section">
        <div>First child</div>
        <div>Second child</div>
        <span>Third child</span>
      </FormSection>
    );
    
    expect(screen.getByText('First child')).toBeInTheDocument();
    expect(screen.getByText('Second child')).toBeInTheDocument();
    expect(screen.getByText('Third child')).toBeInTheDocument();
  });

  it('has correct heading structure', () => {
    render(
      <FormSection title="Test Section" description="Test description">
        <div>Test content</div>
      </FormSection>
    );
    
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent('Test Section');
  });
});